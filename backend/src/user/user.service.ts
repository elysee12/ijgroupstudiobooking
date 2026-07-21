import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UpdatePreferencesDto, ChangePasswordDto } from './dto/update-user.dto';

const USER_SELECT = {
  id: true,
  ref: true,
  fullName: true,
  phone: true,
  email: true,
  address: true,
  avatarUrl: true,
  role: true,
  isActive: true,
  createdAt: true,
  preferences: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ── Admin: list all customers ─────────────────────────────
  async findAll(search?: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        isActive: true,
        ...(search && {
          OR: [
            { fullName: { contains: search } },
            { phone: { contains: search } },
          ],
        }),
      },
      select: {
        ...USER_SELECT,
        _count: { select: { bookings: true } },
        bookings: {
          select: { finalAmount: true, estimatedAmount: true },
          where: { status: { in: ['COMPLETED', 'CONFIRMED'] } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Get single user ───────────────────────────────────────
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT,
        _count: { select: { bookings: true } },
        bookings: {
          select: {
            id: true,
            ref: true,
            status: true,
            eventDate: true,
            finalAmount: true,
            estimatedAmount: true,
            service: { select: { name: true } },
          },
          orderBy: { eventDate: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ── Update profile ────────────────────────────────────────
  async update(id: number, dto: UpdateUserDto) {
    if (dto.phone) {
      const conflict = await this.prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Phone already in use');
    }
    const { password, ...rest } = dto;
    return this.prisma.user.update({
      where: { id },
      data: rest,
      select: USER_SELECT,
    });
  }

  // ── Update preferences ────────────────────────────────────
  async updatePreferences(userId: number, dto: UpdatePreferencesDto) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  // ── Change password ───────────────────────────────────────
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword as string, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const hash = await bcrypt.hash(dto.newPassword as string, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hash } });
    return { message: 'Password updated successfully' };
  }

  // ── Admin: add note to customer ───────────────────────────
  async addNote(customerId: number, content: string, addedById: number) {
    return this.prisma.customerNote.create({
      data: { customerId, content, addedById },
    });
  }

  // ── Admin: deactivate user ────────────────────────────────
  async deactivate(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
  }

  // ── Admin: customer stats ─────────────────────────────────
  async getCustomerStats(customerId: number) {
    const [bookingCount, payments] = await Promise.all([
      this.prisma.booking.count({ where: { customerId } }),
      this.prisma.payment.aggregate({
        where: { customerId, status: 'SUCCESS' },
        _sum: { amount: true },
      }),
    ]);
    const lifetimeValue = payments._sum.amount ?? 0;
    return {
      totalBookings: bookingCount,
      lifetimeValue,
      avgTicket: bookingCount > 0 ? Math.round(lifetimeValue / bookingCount) : 0,
    };
  }

  // ── Upload avatar ────────────────────────────────────────
  async uploadAvatar(userId: number, file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file data received');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${userId}-${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    try {
      fs.writeFileSync(filepath, file.buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to save file: ${error.message}`);
    }

    // Delete old avatar if exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (user?.avatarUrl) {
      try {
        const oldPath = path.join(process.cwd(), user.avatarUrl.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (error) {
        // Ignore errors when deleting old file
        console.warn(`Failed to delete old avatar: ${error.message}`);
      }
    }

    // Update user with new avatar URL
    const avatarUrl = `/uploads/avatars/${filename}`;
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: USER_SELECT,
    });
  }
}
