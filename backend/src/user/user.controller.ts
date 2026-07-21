import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto, UpdatePreferencesDto, ChangePasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ── Customer: get own profile ─────────────────────────────
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: any) {
    return this.userService.findOne(user.id);
  }

  // ── Customer: update own profile ──────────────────────────
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.update(user.id, dto);
  }

  // ── Customer: update preferences ──────────────────────────
  @Patch('me/preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePreferences(@CurrentUser() user: any, @Body() dto: UpdatePreferencesDto) {
    return this.userService.updatePreferences(user.id, dto);
  }

  // ── Customer: change password ──────────────────────────────
  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user.id, dto);
  }

  // ── Customer: upload avatar ───────────────────────────────
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiConsumes('multipart/form-data')
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return this.userService.uploadAvatar(user.id, file);
  }

  // ── Admin: list all customers ─────────────────────────────
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all customers' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.userService.findAll(search);
  }

  // ── Admin: customer stats ─────────────────────────────────
  // This must come BEFORE @Get(':id') to avoid route conflicts
  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get customer stats' })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getCustomerStats(id);
  }

  // ── Admin: get customer detail ────────────────────────────
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get customer detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // ── Admin: add note ───────────────────────────────────────
  @Post(':id/notes')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Add note to customer' })
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string },
    @CurrentUser() admin: any,
  ) {
    return this.userService.addNote(id, body.content, admin.id);
  }

  // ── Admin: deactivate user ────────────────────────────────
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Deactivate user' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deactivate(id);
  }
}
