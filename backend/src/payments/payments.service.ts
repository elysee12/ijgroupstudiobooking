import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private bookingsService: BookingsService,
  ) {}

  // ── Initiate payment ──────────────────────────────────────
  async create(customerId: number, dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== customerId) throw new BadRequestException('Not your booking');
    if (!booking.finalAmount) throw new BadRequestException('Final amount not set yet');

    const txCount = await this.prisma.payment.count();
    const ref = `TX-${String(9000 + txCount + 1)}`;

    // Calculate how much has already been paid
    const paidSoFar = await this.prisma.payment.aggregate({
      where: { bookingId: dto.bookingId, status: 'SUCCESS' },
      _sum: { amount: true },
    });
    const alreadyPaid = paidSoFar._sum.amount ?? 0;
    const remaining = booking.finalAmount - alreadyPaid;

    if (remaining <= 0) {
      throw new BadRequestException('This booking is already fully paid');
    }

    // DEPOSIT = configured deposit amount; FINAL = whatever is still remaining
    const amount =
      dto.type === 'DEPOSIT'
        ? (booking.depositAmount ?? Math.round(booking.finalAmount * 0.3))
        : remaining; // pay exactly what's left

    const payment = await this.prisma.payment.create({
      data: {
        ref,
        bookingId: dto.bookingId,
        customerId,
        amount,
        method: dto.method,
        type: dto.type,
        status: 'PENDING',
        mobilePhone: dto.mobilePhone,
      },
    });

    // Simulate payment processing (replace with real gateway integration)
    await this.processPayment(payment.id, booking.id, dto.type, customerId);

    return payment;
  }

  // ── Simulate gateway callback / confirm payment ───────────
  private async processPayment(
    paymentId: number,
    bookingId: number,
    type: string,
    customerId: number,
  ) {
    // Confirm the payment
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'SUCCESS' },
    });

    // Recalculate total paid across ALL successful payments for this booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { finalAmount: true, depositPaid: true },
    });

    const paidAggregate = await this.prisma.payment.aggregate({
      where: { bookingId, status: 'SUCCESS' },
      _sum: { amount: true },
    });
    const totalPaid = paidAggregate._sum.amount ?? 0;
    const finalAmount = booking?.finalAmount ?? 0;

    // Determine new status:
    // - Fully paid (total paid >= final amount) → COMPLETED
    // - Partial payment (deposit or installment) → CONFIRMED
    const isFullyPaid = finalAmount > 0 && totalPaid >= finalAmount;
    const newStatus = isFullyPaid ? 'COMPLETED' : 'CONFIRMED';
    const isDeposit = type === 'DEPOSIT' || (!isFullyPaid && totalPaid > 0);

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        depositPaid: isDeposit ? true : undefined,
      },
    });

    await this.bookingsService.logActivity(
      bookingId,
      `Payment of ${(await this.prisma.payment.findUnique({ where: { id: paymentId }, select: { amount: true } }))?.amount?.toLocaleString()} RWF received — ${isFullyPaid ? 'FULLY PAID' : `${totalPaid.toLocaleString()} / ${finalAmount.toLocaleString()} RWF paid`}`,
      null,
    );

    // Auto-generate or update invoice
    const existing = await this.prisma.invoice.findUnique({ where: { bookingId } });
    if (!existing) {
      const invCount = await this.prisma.invoice.count();
      const ref = `INV-${String(2000 + invCount + 1)}`;
      await this.prisma.invoice.create({
        data: {
          ref,
          bookingId,
          customerId,
          amount: finalAmount,
          status: isFullyPaid ? 'PAID' : 'PENDING',
        },
      });
    } else if (isFullyPaid) {
      await this.prisma.invoice.update({
        where: { bookingId },
        data: { status: 'PAID' },
      });
    }
  }

  // ── Customer: my payments ─────────────────────────────────
  async findMyPayments(customerId: number) {
    return this.prisma.payment.findMany({
      where: { customerId },
      include: {
        booking: { select: { ref: true, service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Admin: all payments ───────────────────────────────────
  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        customer: { select: { fullName: true, phone: true } },
        booking: { select: { ref: true, service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Admin: payment stats ──────────────────────────────────
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayTotal, weekTotal, monthTotal] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: today } },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: weekStart } },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
    ]);

    return {
      today: todayTotal._sum.amount ?? 0,
      thisWeek: weekTotal._sum.amount ?? 0,
      thisMonth: monthTotal._sum.amount ?? 0,
    };
  }
}
