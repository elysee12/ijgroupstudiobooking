import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: '[Admin] Overall summary stats' })
  getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('revenue')
  @ApiOperation({ summary: '[Admin] Monthly revenue for a year' })
  @ApiQuery({ name: 'year', required: false })
  getRevenue(@Query('year') year?: string) {
    return this.reportsService.getRevenueByMonth(Number(year) || new Date().getFullYear());
  }

  @Get('top-services')
  @ApiOperation({ summary: '[Admin] Top services by booking count' })
  getTopServices() {
    return this.reportsService.getTopServices();
  }

  @Get('payment-methods')
  @ApiOperation({ summary: '[Admin] Payment method breakdown' })
  getPaymentMethods() {
    return this.reportsService.getPaymentMethodBreakdown();
  }

  @Get('customer-growth')
  @ApiOperation({ summary: '[Admin] Monthly new customer count' })
  @ApiQuery({ name: 'year', required: false })
  getCustomerGrowth(@Query('year') year?: string) {
    return this.reportsService.getCustomerGrowth(Number(year) || new Date().getFullYear());
  }
}
