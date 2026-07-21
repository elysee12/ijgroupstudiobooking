import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // ── Get or create conversation ────────────────────────────
  async getOrCreateConversation(customerId: number, bookingId?: number) {
    const existing = await this.prisma.conversation.findFirst({
      where: { customerId, ...(bookingId && { bookingId }) },
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { customerId, bookingId },
    });
  }

  // ── Customer: my conversations ────────────────────────────
  async findMyConversations(customerId: number) {
    return this.prisma.conversation.findMany({
      where: { customerId },
      include: {
        booking: { select: { ref: true, service: { select: { name: true } } } },
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  // ── Admin: all conversations ──────────────────────────────
  async findAllConversations() {
    return this.prisma.conversation.findMany({
      include: {
        customer: { select: { fullName: true, phone: true, avatarUrl: true } },
        booking: { select: { ref: true, service: { select: { name: true } } } },
        messages: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  // ── Get messages in a conversation ────────────────────────
  async getMessages(
    conversationId: number,
    requesterId: number,
    requesterRole: string,
  ) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (requesterRole === 'CUSTOMER' && conv.customerId !== requesterId) {
      throw new ForbiddenException();
    }

    // Mark as read
    if (requesterRole === 'ADMIN') {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadByAdmin: 0 },
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadByCustomer: 0 },
      });
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { fullName: true, role: true, avatarUrl: true } } },
      orderBy: { sentAt: 'asc' },
    });
  }

  // ── Send message ──────────────────────────────────────────
  async sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
    isFromAdmin: boolean,
  ) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.message.create({
      data: { conversationId, senderId, content, isFromAdmin },
      include: { sender: { select: { fullName: true, role: true, avatarUrl: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        ...(isFromAdmin
          ? { unreadByCustomer: { increment: 1 } }
          : { unreadByAdmin: { increment: 1 } }),
      },
    });

    return message;
  }
}
