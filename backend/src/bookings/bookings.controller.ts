import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ── Create booking (works with or without JWT) ────────────
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new booking (auth optional — phone required if not authed)' })
  create(@Request() req: any, @Body() dto: CreateBookingDto) {
    // If authenticated, use their ID; otherwise resolve by phone in the service
    const userId = req.user?.id ?? 0;
    return this.bookingsService.create(userId, dto);
  }

  // ── Customer: my bookings ─────────────────────────────────
  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user bookings' })
  getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.findMyBookings(user.id);
  }

  // ── Customer: dashboard stats ─────────────────────────────
  @Get('my/stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get customer dashboard stats' })
  getMyStats(@CurrentUser() user: any) {
    return this.bookingsService.getDashboardStats(user.id);
  }

  // ── Admin: all bookings ───────────────────────────────────
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all bookings' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.bookingsService.findAll(search, status);
  }

  // ── Admin: overview stats ─────────────────────────────────
  @Get('admin/stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get admin dashboard stats' })
  getAdminStats() {
    return this.bookingsService.getAdminStats();
  }

  // ── Generate QR code for booking ──────────────────────────
  @Get(':id/qr')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get booking QR code' })
  async getQRCode(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const qr = await this.bookingsService.generateQRCode(id, user.id, user.role);
    res.setHeader('Content-Type', 'image/png');
    res.send(qr);
  }

  // ── Download booking ticket/receipt ───────────────────────
  @Get(':id/ticket')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download booking ticket/receipt' })
  async downloadTicket(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const pdf = await this.bookingsService.generateTicket(id, user.id, user.role);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="booking-${id}-ticket.pdf"`);
    res.send(pdf);
  }

  // ── Get single booking ────────────────────────────────────
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get booking detail' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id, user.role);
  }

  // ── Admin: update booking ─────────────────────────────────
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update booking (status, amounts, etc.)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() admin: any,
  ) {
    return this.bookingsService.update(id, dto, admin.id);
  }

  // ── Admin: assign crew ────────────────────────────────────
  @Post(':id/crew')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Assign crew member to booking' })
  assignCrew(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { crewMemberId: number; roleOverride?: string },
  ) {
    return this.bookingsService.assignCrew(id, body.crewMemberId, body.roleOverride);
  }

  // ── Admin: remove crew ────────────────────────────────────
  @Delete(':id/crew/:crewMemberId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Remove crew member from booking' })
  removeCrew(
    @Param('id', ParseIntPipe) id: number,
    @Param('crewMemberId', ParseIntPipe) crewMemberId: number,
  ) {
    return this.bookingsService.removeCrew(id, crewMemberId);
  }

  // ── Admin: cancel booking ─────────────────────────────────
  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Cancel a booking' })
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() admin: any) {
    return this.bookingsService.cancel(id, admin.id);
  }
}
