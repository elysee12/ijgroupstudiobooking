import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private mailer: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.mailer = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: Number(this.config.get('EMAIL_PORT') ?? 587),
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /** Find user by phone or email */
  private async findUser(identifier: string) {
    if (this.isEmail(identifier)) {
      return this.prisma.user.findUnique({ where: { email: identifier } });
    }
    return this.prisma.user.findUnique({ where: { phone: identifier } });
  }

  // ── Register ──────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const phoneExists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (phoneExists) throw new ConflictException('Phone number already registered');

    if (dto.email) {
      const emailExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (emailExists) throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const count = await this.prisma.user.count();
    const ref = `IJ-C-${String(count + 1).padStart(4, '0')}`;

    const user = await this.prisma.user.create({
      data: {
        ref,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        password: hash,
        preferences: { create: {} },
      },
      select: { id: true, ref: true, fullName: true, phone: true, email: true, role: true },
    });

    await this.generateAndSendOtp(user.id, user.phone, user.email ?? undefined);

    return {
      message: `OTP sent to your ${user.email ? 'email and ' : ''}phone`,
      userId: user.id,
      identifier: user.phone,
    };
  }

  // ── Login ─────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.findUser(dto.identifier);
    if (!user) throw new UnauthorizedException('No account found with those credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Incorrect password');

    await this.generateAndSendOtp(user.id, user.phone, user.email ?? undefined);

    // Return the identifier back so the frontend knows what to show in the OTP step
    const sentTo = this.isEmail(dto.identifier) ? dto.identifier : user.phone;
    return {
      message: `OTP sent to ${sentTo}`,
      userId: user.id,
      identifier: user.phone, // always use phone as the canonical OTP key
      sentToEmail: !!user.email,
      displayIdentifier: sentTo,
    };
  }

  // ── Verify OTP & issue JWT ────────────────────────────────
  async verifyOtp(dto: VerifyOtpDto) {
    // Resolve phone from identifier (could be email or phone)
    let phone = dto.identifier;
    if (this.isEmail(dto.identifier)) {
      const user = await this.prisma.user.findUnique({ where: { email: dto.identifier } });
      if (!user) throw new BadRequestException('Account not found');
      phone = user.phone;
    }

    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Invalid or expired OTP. Please request a new one.');

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    const user = await this.prisma.user.findUnique({
      where: { id: otp.userId },
      select: {
        id: true, ref: true, fullName: true,
        phone: true, email: true, role: true, avatarUrl: true,
      },
    });
    if (!user) throw new BadRequestException('User not found');

    const token = this.jwt.sign({ sub: user.id, phone: user.phone, role: user.role });
    return { accessToken: token, user };
  }

  // ── Check phone ───────────────────────────────────────────
  async checkPhone(phone: string): Promise<{ exists: boolean; name?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      select: { id: true, fullName: true },
    });
    if (!user) return { exists: false };
    return { exists: true, name: user.fullName.split(' ')[0] };
  }

  // ── Check identifier (phone or email) ─────────────────────
  async checkIdentifier(
    phone?: string,
    email?: string,
  ): Promise<{ phoneExists: boolean; emailExists: boolean; name?: string }> {
    let phoneExists = false;
    let emailExists = false;
    let name: string | undefined;

    if (phone) {
      const u = await this.prisma.user.findUnique({
        where: { phone },
        select: { fullName: true },
      });
      if (u) { phoneExists = true; name = u.fullName.split(' ')[0]; }
    }

    if (email) {
      const u = await this.prisma.user.findUnique({
        where: { email },
        select: { fullName: true },
      });
      if (u) { emailExists = true; name = name ?? u.fullName.split(' ')[0]; }
    }

    return { phoneExists, emailExists, name };
  }

  // ── Resend OTP ────────────────────────────────────────────
  async resendOtp(identifier: string) {
    const user = await this.findUser(identifier);
    if (!user) throw new BadRequestException('No account found');
    await this.generateAndSendOtp(user.id, user.phone, user.email ?? undefined);
    return { message: 'OTP resent successfully' };
  }

  // ── Internal: generate, store & deliver OTP ───────────────
  private async generateAndSendOtp(
    userId: number,
    phone: string,
    email?: string,
  ) {
    // Invalidate all previous unused OTPs for this user
    await this.prisma.otpCode.updateMany({
      where: { userId, used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.prisma.otpCode.create({ data: { userId, phone, code, expiresAt } });

    // Always log to console (visible in backend terminal during dev)
    console.log(`\n╔══════════════════════════════╗`);
    console.log(`║  OTP CODE: ${code}           ║`);
    console.log(`║  Phone:    ${phone.padEnd(18)} ║`);
    if (email) console.log(`║  Email:    ${email.substring(0, 18).padEnd(18)} ║`);
    console.log(`╚══════════════════════════════╝\n`);

    // Send via email if available (uses your SMTP config)
    if (email) {
      try {
        await this.mailer.sendMail({
          from: `"IJ Group Studio" <${this.config.get('SMTP_USER')}>`,
          to: email,
          subject: `Your IJ Group Studio verification code: ${code}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#1a1a1a;color:#f5f5f5;border-radius:12px;">
              <h1 style="font-size:28px;margin:0 0 8px;color:#f97316;">IJ Group Studio</h1>
              <p style="color:#aaa;margin:0 0 32px;font-size:14px;">Photography & Videography · Kigali</p>
              <p style="font-size:15px;margin:0 0 24px;">Your verification code is:</p>
              <div style="background:#2a2a2a;border:2px solid #f97316;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#f97316;">${code}</span>
              </div>
              <p style="font-size:13px;color:#888;margin:0;">This code expires in <strong style="color:#f5f5f5;">10 minutes</strong>. Do not share it with anyone.</p>
              <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
              <p style="font-size:12px;color:#666;margin:0;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        console.log(`[OTP] Email sent to ${email}`);
      } catch (err) {
        // Email failure is non-fatal — OTP is still in the DB and logged to console
        console.error(`[OTP] Email delivery failed: ${err.message}`);
      }
    }

    // TODO: Add SMS gateway here (Africa's Talking / Twilio)
    // await this.smsService.send(phone, `Your IJ Group Studio code: ${code}`);
  }
}
