import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Homepage')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  // ── PUBLIC endpoints (no auth) ────────────────────────────────────────────

  @Get('featured-services')
  @ApiOperation({ summary: 'Get visible featured services for homepage' })
  getFeaturedServices() {
    return this.homepageService.getFeaturedServices(true);
  }

  @Get('work')
  @ApiOperation({ summary: 'Get visible recent work items for homepage' })
  getWork() {
    return this.homepageService.getHomepageWork(true);
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get visible testimonials for homepage' })
  getTestimonials() {
    return this.homepageService.getTestimonials(true);
  }

  // ── ADMIN: Featured Services ──────────────────────────────────────────────

  @Get('admin/featured-services')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get all featured services (incl. hidden)' })
  adminGetFeaturedServices() {
    return this.homepageService.getFeaturedServices(false);
  }

  @Post('admin/featured-services')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Create featured service' })
  createFeaturedService(@Body() body: any) {
    return this.homepageService.createFeaturedService(body);
  }

  @Patch('admin/featured-services/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update featured service' })
  updateFeaturedService(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.homepageService.updateFeaturedService(id, body);
  }

  @Delete('admin/featured-services/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete featured service' })
  deleteFeaturedService(@Param('id', ParseIntPipe) id: number) {
    return this.homepageService.deleteFeaturedService(id);
  }

  // ── ADMIN: Recent Work ────────────────────────────────────────────────────

  @Get('admin/work')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get all work items (incl. hidden)' })
  adminGetWork() {
    return this.homepageService.getHomepageWork(false);
  }

  @Post('admin/work')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Create work item' })
  createWork(@Body() body: any) {
    return this.homepageService.createHomepageWork(body);
  }

  @Patch('admin/work/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update work item' })
  updateWork(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.homepageService.updateHomepageWork(id, body);
  }

  @Delete('admin/work/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete work item' })
  deleteWork(@Param('id', ParseIntPipe) id: number) {
    return this.homepageService.deleteHomepageWork(id);
  }

  // ── ADMIN: Testimonials ───────────────────────────────────────────────────

  @Get('admin/testimonials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get all testimonials (incl. hidden)' })
  adminGetTestimonials() {
    return this.homepageService.getTestimonials(false);
  }

  @Post('admin/testimonials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Create testimonial' })
  createTestimonial(@Body() body: any) {
    return this.homepageService.createTestimonial(body);
  }

  @Patch('admin/testimonials/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update testimonial' })
  updateTestimonial(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.homepageService.updateTestimonial(id, body);
  }

  @Delete('admin/testimonials/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete testimonial' })
  deleteTestimonial(@Param('id', ParseIntPipe) id: number) {
    return this.homepageService.deleteTestimonial(id);
  }
}
