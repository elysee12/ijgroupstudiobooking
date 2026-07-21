import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SERVICE_TYPES = [
  'WEDDING_PHOTOGRAPHY', 'STUDIO_PHOTOSHOOT', 'GRADUATION_PHOTOGRAPHY',
  'BIRTHDAY_COVERAGE', 'DRONE_VIDEOGRAPHY', 'MUSIC_VIDEO',
  'LIVESTREAMING', 'CORPORATE_EVENT',
] as const;

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // ── Public: active services only ──────────────────────────────────────────
  findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // ── Admin: all services including inactive ────────────────────────────────
  findAllAdmin() {
    return this.prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  // ── Admin: create service ─────────────────────────────────────────────────
  async createService(dto: {
    name: string;
    description?: string;
    basePrice: number;
    category: string;
    iconName?: string;
  }) {
    // Auto-generate a unique type key from the name
    const typeKey = dto.name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    // Check if type already exists; append a counter if needed
    let finalType = typeKey;
    let counter = 1;
    while (await this.prisma.service.findFirst({ where: { type: finalType as any } })) {
      finalType = `${typeKey}_${counter++}`;
    }

    return this.prisma.service.create({
      data: {
        type: finalType as any,
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        category: dto.category,
        iconName: dto.iconName,
        isActive: true,
      },
    });
  }

  // ── Admin: update service ─────────────────────────────────────────────────
  async updateService(id: number, dto: {
    name?: string;
    description?: string;
    basePrice?: number;
    category?: string;
    iconName?: string;
    isActive?: boolean;
  }) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  // ── Admin: toggle active ──────────────────────────────────────────────────
  async toggleActive(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }

  // ── Admin: delete service ─────────────────────────────────────────────────
  async deleteService(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    // Soft delete — just deactivate if it has bookings, hard delete if not
    const bookingCount = await this.prisma.booking.count({ where: { serviceId: id } });
    if (bookingCount > 0) {
      return this.prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
    }
    return this.prisma.service.delete({ where: { id } });
  }

  // ── Existing helpers ──────────────────────────────────────────────────────
  findAllAddOns() {
    return this.prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findAllPackages() {
    return this.prisma.pricingPackage.findMany({
      where: { isActive: true },
      include: { features: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { price: 'asc' },
    });
  }

  async updateServicePrice(id: number, basePrice: number) {
    return this.prisma.service.update({
      where: { id },
      data: { basePrice },
    });
  }
}
