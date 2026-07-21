import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findMyInvoices(customerId: number) {
    return this.prisma.invoice.findMany({
      where: { customerId },
      include: {
        booking: { select: { ref: true, service: { select: { name: true } } } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findOne(id: number, requesterId: number, requesterRole: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            service: true,
            customer: { select: { fullName: true, phone: true, email: true, address: true } },
            addOns: { include: { addOn: true } },
          },
        },
        customer: { select: { fullName: true, phone: true, email: true } },
      },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (requesterRole === 'CUSTOMER' && invoice.customerId !== requesterId) {
      throw new ForbiddenException();
    }
    return invoice;
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        customer: { select: { fullName: true, phone: true } },
        booking: { select: { ref: true, service: { select: { name: true } } } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
