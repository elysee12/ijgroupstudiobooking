import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getPublicInfo() {
    const s = await this.prisma.studioSettings.findUnique({ where: { id: 1 } });
    if (!s) return { studioName: 'IJ Group Studio', phone: '', email: '', location: '', about: '' };
    return {
      studioName: s.studioName,
      phone: s.phone,
      email: s.email,
      location: s.location,
      about: s.about,
    };
  }

  async getSettings() {
    return this.prisma.studioSettings.findUnique({
      where: { id: 1 },
      include: {
        paymentIntegrations: {
          select: { id: true, provider: true, isConnected: true },
        },
      },
    });
  }

  async updateSettings(dto: {
    studioName?: string;
    phone?: string;
    email?: string;
    location?: string;
    about?: string;
    requireDeposit?: boolean;
    depositPercent?: number;
    autoWatermark?: boolean;
    sendSmsOnBooking?: boolean;
    allowWhatsApp?: boolean;
  }) {
    return this.prisma.studioSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        studioName: dto.studioName ?? 'IJ Group Studio',
        phone: dto.phone ?? '',
        email: dto.email ?? '',
        location: dto.location ?? '',
        ...dto,
      },
      update: dto,
      include: {
        paymentIntegrations: {
          select: { id: true, provider: true, isConnected: true },
        },
      },
    });
  }

  async updateIntegration(provider: string, isConnected: boolean) {
    return this.prisma.paymentIntegration.upsert({
      where: { studioSettingsId_provider: { studioSettingsId: 1, provider } },
      create: { studioSettingsId: 1, provider, isConnected },
      update: { isConnected },
    });
  }

  // ── Crew management ───────────────────────────────────────
  async getCrewMembers() {
    return this.prisma.crewMember.findMany({
      where: { isActive: true },
      include: { user: { select: { fullName: true, phone: true, avatarUrl: true } } },
    });
  }

  async createCrewMember(userId: number, jobTitle: string, bio?: string) {
    return this.prisma.crewMember.create({
      data: { userId, jobTitle, bio },
      include: { user: { select: { fullName: true, phone: true } } },
    });
  }
}
