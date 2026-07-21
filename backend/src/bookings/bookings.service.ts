import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

const BOOKING_INCLUDE = {
  service: { select: { name: true, type: true } },
  customer: { select: { id: true, ref: true, fullName: true, phone: true, email: true } },
  payments: { orderBy: { createdAt: 'desc' as const } },
  invoice: true,
  crew: {
    include: {
      crewMember: {
        include: { user: { select: { fullName: true, avatarUrl: true } } },
      },
    },
  },
  addOns: { include: { addOn: true } },
  activities: { orderBy: { createdAt: 'desc' as const }, take: 20 },
  albums: { select: { id: true, name: true, coverUrl: true, isPublic: true } },
};

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ── Create booking ────────────────────────────────────────
  async create(customerId: number, dto: CreateBookingDto) {
    // Resolve the actual customer:
    // 1. If a phone is provided, look up by phone (works for both authed and unauthed)
    // 2. If authenticated (customerId > 0) and no phone override, use their ID directly
    let resolvedCustomerId = customerId;

    if (dto.phone) {
      const userByPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
        select: { id: true },
      });
      if (!userByPhone) {
        throw new BadRequestException(
          'No account found for this phone number. Please create an account first.',
        );
      }
      resolvedCustomerId = userByPhone.id;
    } else if (!customerId || customerId === 0) {
      throw new BadRequestException(
        'Phone number is required to create a booking without an account.',
      );
    }

    const count = await this.prisma.booking.count();
    const ref = `IJ-${String(1000 + count + 1)}`;

    const settings = await this.prisma.studioSettings.findUnique({ where: { id: 1 } });
    const depositPercent = settings?.depositPercent ?? 30;

    const booking = await this.prisma.booking.create({
      data: {
        ref,
        customerId: resolvedCustomerId,
        serviceId: dto.serviceId,
        shootType: dto.shootType,
        eventDate: new Date(dto.eventDate),
        location: dto.location,
        brief: dto.brief,
        status: 'PENDING',
        ...(dto.addOnIds?.length && {
          addOns: {
            create: await Promise.all(
              dto.addOnIds.map(async (addOnId) => {
                const addOn = await this.prisma.addOn.findUnique({ where: { id: addOnId } });
                return { addOnId, unitPrice: addOn?.price ?? 0 };
              }),
            ),
          },
        }),
      },
      include: BOOKING_INCLUDE,
    });

    // Log activity
    await this.logActivity(booking.id, 'Booking created', null);

    return booking;
  }

  // ── Customer: my bookings ─────────────────────────────────
  async findMyBookings(customerId: number) {
    return this.prisma.booking.findMany({
      where: { customerId },
      include: {
        service: { select: { name: true } },
        payments: {
          where: { status: 'SUCCESS' },
          select: { amount: true, type: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        invoice: { select: { id: true, ref: true, status: true } },
      },
      orderBy: { eventDate: 'desc' },
    });
  }

  // ── Admin: all bookings ───────────────────────────────────
  async findAll(search?: string, status?: string) {
    return this.prisma.booking.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(search && {
          OR: [
            { ref: { contains: search } },
            { customer: { phone: { contains: search } } },
            { customer: { fullName: { contains: search } } },
          ],
        }),
      },
      include: {
        service: { select: { name: true } },
        customer: { select: { id: true, ref: true, fullName: true, phone: true } },
        payments: { where: { status: 'SUCCESS' }, select: { amount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Get single booking ────────────────────────────────────
  async findOne(id: number, requesterId: number, requesterRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (requesterRole === 'CUSTOMER' && booking.customerId !== requesterId) {
      throw new ForbiddenException();
    }
    return booking;
  }

  // ── Admin: update booking ─────────────────────────────────
  async update(id: number, dto: UpdateBookingDto, adminId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
        ...(dto.finalAmount && !dto.depositAmount && {
          depositAmount: Math.round(dto.finalAmount * 0.3),
        }),
      },
      include: BOOKING_INCLUDE,
    });

    if (dto.status) {
      await this.logActivity(id, `Status changed to ${dto.status}`, adminId);
    }
    if (dto.finalAmount) {
      await this.logActivity(id, `Final amount set to ${dto.finalAmount} RWF`, adminId);
    }

    return updated;
  }

  // ── Admin: assign crew ────────────────────────────────────
  async assignCrew(bookingId: number, crewMemberId: number, roleOverride?: string) {
    return this.prisma.bookingCrew.upsert({
      where: { bookingId_crewMemberId: { bookingId, crewMemberId } },
      create: { bookingId, crewMemberId, roleOverride },
      update: { roleOverride },
    });
  }

  // ── Admin: remove crew ────────────────────────────────────
  async removeCrew(bookingId: number, crewMemberId: number) {
    return this.prisma.bookingCrew.delete({
      where: { bookingId_crewMemberId: { bookingId, crewMemberId } },
    });
  }

  // ── Admin: cancel booking ─────────────────────────────────
  async cancel(id: number, adminId: number) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    await this.logActivity(id, 'Booking cancelled', adminId);
    return booking;
  }

  // ── Dashboard stats ───────────────────────────────────────
  async getDashboardStats(customerId: number) {
    const [total, upcoming, completed, mediaCount] = await Promise.all([
      this.prisma.booking.count({ where: { customerId } }),
      this.prisma.booking.count({
        where: { customerId, status: 'CONFIRMED', eventDate: { gte: new Date() } },
      }),
      this.prisma.booking.count({ where: { customerId, status: 'COMPLETED' } }),
      this.prisma.mediaFile.count({
        where: { album: { customerId } },
      }),
    ]);
    return { total, upcoming, completed, mediaCount };
  }

  // ── Admin overview stats ──────────────────────────────────
  async getAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalBookings,
      pendingNegotiation,
      confirmedThisMonth,
      revenueThisMonth,
      upcomingEvents,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: { in: ['PENDING', 'NEGOTIATION'] } } }),
      this.prisma.booking.count({
        where: { status: 'CONFIRMED', createdAt: { gte: monthStart } },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.booking.findMany({
        where: { status: 'CONFIRMED', eventDate: { gte: new Date() } },
        include: {
          service: { select: { name: true } },
          customer: { select: { fullName: true, phone: true } },
        },
        orderBy: { eventDate: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalBookings,
      pendingNegotiation,
      confirmedThisMonth,
      revenueThisMonth: revenueThisMonth._sum.amount ?? 0,
      upcomingEvents,
    };
  }

  // ── Internal: log activity ────────────────────────────────
  async logActivity(bookingId: number, description: string, createdById: number | null) {
    return this.prisma.bookingActivity.create({
      data: { bookingId, description, createdById },
    });
  }

  // ── Generate QR code ──────────────────────────────────────
  async generateQRCode(bookingId: number, requesterId: number, requesterRole: string): Promise<Buffer> {
    const booking = await this.findOne(bookingId, requesterId, requesterRole);
    
    // Generate QR code data with booking details
    const qrData = JSON.stringify({
      ref: booking.ref,
      customer: booking.customer?.fullName,
      service: booking.service?.name,
      date: booking.eventDate,
      status: booking.status,
      amount: booking.finalAmount,
    });

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrBuffer;
  }

  // ── Generate booking ticket/receipt ───────────────────────
  async generateTicket(bookingId: number, requesterId: number, requesterRole: string): Promise<Buffer> {
    const booking = await this.findOne(bookingId, requesterId, requesterRole);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('IJ GROUP STUDIO', { align: 'center' })
        .fontSize(10)
        .font('Helvetica')
        .text('Booking Confirmation Ticket', { align: 'center' })
        .moveDown();

      // Booking reference
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(`Ref: ${booking.ref}`, { align: 'center' })
        .moveDown()
        .fontSize(12)
        .fillColor('#666666')
        .text(
          `Status: ${booking.status.replace(/_/g, ' ')}`,
          { align: 'center' },
        )
        .fillColor('#000000')
        .moveDown(2);

      // Customer details
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Customer Details')
        .moveDown(0.5)
        .fontSize(11)
        .font('Helvetica')
        .text(`Name: ${booking.customer?.fullName}`)
        .text(`Phone: ${booking.customer?.phone}`)
        .text(`Email: ${booking.customer?.email || 'N/A'}`)
        .moveDown();

      // Booking details
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Booking Details')
        .moveDown(0.5)
        .fontSize(11)
        .font('Helvetica')
        .text(`Service: ${booking.service?.name}`)
        .text(`Type: ${booking.shootType}`)
        .text(`Date: ${new Date(booking.eventDate).toLocaleString()}`)
        .text(`Location: ${booking.location}`)
        .moveDown();

      // Payment details
      if (booking.finalAmount) {
        const paidAmount = (booking.payments || [])
          .filter((p) => p.status === 'SUCCESS')
          .reduce((sum, p) => sum + p.amount, 0);
        const remaining = booking.finalAmount - paidAmount;

        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Payment Details')
          .moveDown(0.5)
          .fontSize(11)
          .font('Helvetica')
          .text(`Total Amount: ${booking.finalAmount.toLocaleString()} RWF`)
          .text(`Paid: ${paidAmount.toLocaleString()} RWF`)
          .text(`Remaining: ${remaining.toLocaleString()} RWF`)
          .moveDown();
      }

      // Payment history
      if (booking.payments && booking.payments.length > 0) {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Payment History')
          .moveDown(0.5)
          .fontSize(10)
          .font('Helvetica');

        booking.payments.forEach((payment, index) => {
          doc.text(
            `${index + 1}. ${new Date(payment.createdAt).toLocaleDateString()} - ${payment.amount.toLocaleString()} RWF (${payment.type}) - ${payment.status}`,
          );
        });
        doc.moveDown();
      }

      // Brief
      if (booking.brief) {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Brief')
          .moveDown(0.5)
          .fontSize(10)
          .font('Helvetica')
          .text(booking.brief, { align: 'justify' })
          .moveDown();
      }

      // Footer
      doc
        .moveDown(2)
        .fontSize(9)
        .fillColor('#666666')
        .text('Thank you for choosing IJ Group Studio!', { align: 'center' })
        .text('Contact: info@ijgroupstudio.rw | +250 788 000 000', {
          align: 'center',
        })
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });

      doc.end();
    });
  }
}
