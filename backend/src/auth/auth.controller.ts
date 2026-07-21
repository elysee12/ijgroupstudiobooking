import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new customer account' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with phone or email + password (triggers OTP)' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and receive JWT access token' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP (accepts phone or email)' })
  resendOtp(@Body() body: { identifier: string }) {
    return this.authService.resendOtp(body.identifier);
  }

  @Post('check-phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if a phone number has a registered account' })
  checkPhone(@Body() body: { phone: string }) {
    return this.authService.checkPhone(body.phone);
  }

  @Post('check-identifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if phone or email exists (for booking form live validation)' })
  checkIdentifier(@Body() body: { phone?: string; email?: string }) {
    return this.authService.checkIdentifier(body.phone, body.email);
  }
}
