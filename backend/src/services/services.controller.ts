import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ── Public ────────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List all active services (used in booking form)' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('add-ons')
  @ApiOperation({ summary: 'List all add-ons' })
  findAddOns() {
    return this.servicesService.findAllAddOns();
  }

  @Get('packages')
  @ApiOperation({ summary: 'List all pricing packages' })
  findPackages() {
    return this.servicesService.findAllPackages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all services including inactive' })
  findAllAdmin() {
    return this.servicesService.findAllAdmin();
  }

  @Post('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Create a new service' })
  createService(@Body() body: any) {
    return this.servicesService.createService(body);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update service details' })
  updateService(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.servicesService.updateService(id, body);
  }

  @Patch('admin/:id/toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Toggle service active/inactive' })
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.toggleActive(id);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete service (soft-deletes if has bookings)' })
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.deleteService(id);
  }

  @Patch(':id/price')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update service base price' })
  updatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { basePrice: number },
  ) {
    return this.servicesService.updateServicePrice(id, body.basePrice);
  }
}
