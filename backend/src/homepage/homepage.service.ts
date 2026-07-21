import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomepageService {
  constructor(private prisma: PrismaService) {}

  // ── Featured Services ─────────────────────────────────────────────────────

  getFeaturedServices(visibleOnly = true) {
    return this.prisma.featuredService.findMany({
      where: visibleOnly ? { isVisible: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createFeaturedService(dto: {
    title: string;
    description: string;
    price: string;
    iconName: string;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    return this.prisma.featuredService.create({ data: dto });
  }

  async updateFeaturedService(id: number, dto: Partial<{
    title: string;
    description: string;
    price: string;
    iconName: string;
    sortOrder: number;
    isVisible: boolean;
  }>) {
    try {
      return await this.prisma.featuredService.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Featured service not found');
      throw error;
    }
  }

  async deleteFeaturedService(id: number) {
    try {
      return await this.prisma.featuredService.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Featured service not found');
      throw error;
    }
  }

  // ── Homepage Work (Recent Work) ───────────────────────────────────────────

  getHomepageWork(visibleOnly = true) {
    return this.prisma.homepageWork.findMany({
      where: visibleOnly ? { isVisible: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createHomepageWork(dto: {
    title: string;
    imageUrl: string;
    category: string;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    return this.prisma.homepageWork.create({ data: dto });
  }

  async updateHomepageWork(id: number, dto: Partial<{
    title: string;
    imageUrl: string;
    category: string;
    sortOrder: number;
    isVisible: boolean;
  }>) {
    const performUpdate = () => this.prisma.homepageWork.update({ where: { id }, data: dto });

    try {
      return await performUpdate();
    } catch (error) {
      if (error.code === 'P1017') {
        // Connection closed - wait 500ms and try one more time
        await new Promise((resolve) => setTimeout(resolve, 500));
        try {
          return await performUpdate();
        } catch (retryError) {
          throw retryError;
        }
      }
      if (error.code === 'P2025') throw new NotFoundException('Homepage work item not found');
      throw error;
    }
  }

  async deleteHomepageWork(id: number) {
    try {
      return await this.prisma.homepageWork.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Homepage work item not found');
      throw error;
    }
  }

  // ── Testimonials ──────────────────────────────────────────────────────────

  getTestimonials(visibleOnly = true) {
    return this.prisma.testimonial.findMany({
      where: visibleOnly ? { isVisible: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createTestimonial(dto: {
    clientName: string;
    quote: string;
    rating?: number;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    return this.prisma.testimonial.create({ data: dto });
  }

  async updateTestimonial(id: number, dto: Partial<{
    clientName: string;
    quote: string;
    rating: number;
    sortOrder: number;
    isVisible: boolean;
  }>) {
    try {
      return await this.prisma.testimonial.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Testimonial not found');
      throw error;
    }
  }

  async deleteTestimonial(id: number) {
    try {
      return await this.prisma.testimonial.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Testimonial not found');
      throw error;
    }
  }
}
