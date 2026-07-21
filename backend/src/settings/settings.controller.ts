import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ── Public: studio name, phone, email, location, about ───────────────────
  @Get('public')
  @ApiOperation({ summary: 'Get public studio info (no auth required)' })
  getPublic() {
    return this.settingsService.getPublicInfo();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get full studio settings' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update studio settings' })
  updateSettings(@Body() body: any) {
    return this.settingsService.updateSettings(body);
  }

  @Patch('integrations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Toggle payment integration' })
  updateIntegration(@Body() body: { provider: string; isConnected: boolean }) {
    return this.settingsService.updateIntegration(body.provider, body.isConnected);
  }

  @Get('crew')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List crew members' })
  getCrew() {
    return this.settingsService.getCrewMembers();
  }

  @Post('crew')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Add crew member' })
  addCrew(@Body() body: { userId: number; jobTitle: string; bio?: string }) {
    return this.settingsService.createCrewMember(body.userId, body.jobTitle, body.bio);
  }
}
