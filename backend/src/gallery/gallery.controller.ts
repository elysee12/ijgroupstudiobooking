import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // ── Public: gallery page ──────────────────────────────────
  @Get('public')
  @ApiOperation({ summary: 'Get public gallery albums' })
  @ApiQuery({ name: 'category', required: false })
  getPublic(@Query('category') category?: string) {
    return this.galleryService.findPublicAlbums(category);
  }

  // ── Customer: my media ────────────────────────────────────
  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user media albums' })
  getMyAlbums(@CurrentUser() user: any) {
    return this.galleryService.findMyAlbums(user.id);
  }

  // ── Admin: all albums ─────────────────────────────────────
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all albums' })
  findAll() {
    return this.galleryService.findAllAlbums();
  }

  // ── Get album with files ──────────────────────────────────
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get album files' })
  getAlbum(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.galleryService.getAlbumFiles(id, user.id, user.role);
  }

  // ── Admin: create album ───────────────────────────────────
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Create album' })
  createAlbum(@Body() body: any) {
    return this.galleryService.createAlbum(body);
  }

  // ── Admin: update album ───────────────────────────────────
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update album' })
  updateAlbum(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.galleryService.updateAlbum(id, body);
  }

  // ── Admin: delete album ───────────────────────────────────
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete album' })
  deleteAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.deleteAlbum(id);
  }

  // ── Admin: add file ───────────────────────────────────────
  @Post(':id/files')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Add file to album' })
  addFile(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.galleryService.addFile(id, body);
  }

  // ── Admin: delete file ────────────────────────────────────
  @Delete('files/:fileId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Delete media file' })
  deleteFile(@Param('fileId', ParseIntPipe) fileId: number) {
    return this.galleryService.deleteFile(fileId);
  }
}
