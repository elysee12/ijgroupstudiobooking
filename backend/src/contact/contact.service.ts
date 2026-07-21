import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: Number(this.config.get('EMAIL_PORT')),
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async submit(dto: {
    name: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    const inquiry = await this.prisma.contactInquiry.create({ data: dto });

    // Send notification email to studio
    try {
      await this.transporter.sendMail({
        from: `"IJ Group Studio" <${this.config.get('SMTP_USER')}>`,
        to: this.config.get('CONTACT_TO_EMAIL'),
        subject: `New inquiry: ${dto.subject}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${dto.name}</p>
          <p><strong>Phone:</strong> ${dto.phone}</p>
          <p><strong>Subject:</strong> ${dto.subject}</p>
          <p><strong>Message:</strong><br/>${dto.message}</p>
        `,
      });
    } catch (err) {
      console.error('[Email] Failed to send contact notification:', err.message);
    }

    return { message: 'Inquiry submitted successfully', id: inquiry.id };
  }

  findAll() {
    return this.prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: number) {
    return this.prisma.contactInquiry.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
