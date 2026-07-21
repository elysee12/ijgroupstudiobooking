import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueByMonth(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const payments = await this.prisma.payment.findMany({
      where: { status: 'SUCCESS', createdAt: { gte: start, lt: end } },
      select: { amount: true, createdAt: true },
    });

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i).toLocaleString('default', { month: 'short' }),
      revenue: 0,
    }));

    for (const p of payments) {
      const m = new Date(p.createdAt).getMonth();
      monthly[m].revenue += p.amount;
    }

    return monthly;
  }

  async getTopServices() {
    const bookings = await this.prisma.booking.groupBy({
      by: ['serviceId'],
      _count: { id: true },
      _sum: { finalAmount: true },
      where: { status: { in: ['COMPLETED', 'CONFIRMED'] } },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    });

    const services = await this.prisma.service.findMany({
      where: { id: { in: bookings.map((b) => b.serviceId) } },
      select: { id: true, name: true },
    });

    return bookings.map((b) => ({
      service: services.find((s) => s.id === b.serviceId)?.name ?? 'Unknown',
      count: b._count.id,
      revenue: b._sum.finalAmount ?? 0,
    }));
  }

  async getPaymentMethodBreakdown() {
    const methods = await this.prisma.payment.groupBy({
      by: ['method'],
      _count: { id: true },
      _sum: { amount: true },
      where: { status: 'SUCCESS' },
    });
    return methods.map((m) => ({
      method: m.method,
      count: m._count.id,
      total: m._sum.amount ?? 0,
    }));
  }

  async getCustomerGrowth(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const users = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER', createdAt: { gte: start, lt: end } },
      select: { createdAt: true },
    });

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i).toLocaleString('default', { month: 'short' }),
      newCustomers: 0,
    }));

    for (const u of users) {
      const m = new Date(u.createdAt).getMonth();
      monthly[m].newCustomers += 1;
    }

    return monthly;
  }

  async getSummary() {
    const [totalRevenue, totalCustomers, totalBookings, completedBookings] =
      await Promise.all([
        this.prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true },
        }),
        this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
        this.prisma.booking.count(),
        this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      totalCustomers,
      totalBookings,
      completedBookings,
    };
  }
}
