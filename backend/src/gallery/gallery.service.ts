import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  // ── Public gallery ────────────────────────────────────────
  findPublicAlbums(category?: string) {
    return this.prisma.album.findMany({
      where: {
        isPublic: true,
        ...(category && category !== 'All' && { category }),
      },
      include: { _count: { select: { files: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Customer: my albums ───────────────────────────────────
  findMyAlbums(customerId: number) {
    return this.prisma.album.findMany({
      where: { customerId },
      include: { _count: { select: { files: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Admin: all albums ─────────────────────────────────────
  findAllAlbums() {
    return this.prisma.album.findMany({
      include: {
        _count: { select: { files: true } },
        booking: { select: { ref: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Get album files ───────────────────────────────────────
  async getAlbumFiles(
    albumId: number,
    requesterId: number,
    requesterRole: string,
  ) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: { files: { orderBy: { createdAt: 'asc' } } },
    });
    if (!album) throw new NotFoundException('Album not found');
    if (!album.isPublic && requesterRole === 'CUSTOMER' && album.customerId !== requesterId) {
      throw new ForbiddenException();
    }
    return album;
  }

  // ── Admin: update album ──────────────────────────────────
  async updateAlbum(
    albumId: number,
    dto: {
      name?: string;
      category?: string;
      isPublic?: boolean;
      isWatermarked?: boolean;
      coverUrl?: string;
    },
  ) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');
    return this.prisma.album.update({ where: { id: albumId }, data: dto });
  }

  // ── Admin: delete album ───────────────────────────────────
  async deleteAlbum(albumId: number) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');
    return this.prisma.album.delete({ where: { id: albumId } });
  }

  // ── Admin: create album ───────────────────────────────────
  async createAlbum(dto: {
    name: string;
    category: string;
    bookingId?: number;
    customerId?: number;
    isPublic?: boolean;
    coverUrl?: string;
  }) {
    return this.prisma.album.create({ data: dto });
  }

  // ── Admin: add file to album ──────────────────────────────
  async addFile(albumId: number, dto: {
    url: string;
    type: 'PHOTO' | 'VIDEO';
    fileSize?: number;
    mimeType?: string;
  }) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');

    const settings = await this.prisma.studioSettings.findUnique({ where: { id: 1 } });
    const isWatermarked = settings?.autoWatermark ?? true;

    return this.prisma.mediaFile.create({
      data: { albumId, ...dto, isWatermarked },
    });
  }

  // ── Admin: delete file ────────────────────────────────────
  async deleteFile(fileId: number) {
    return this.prisma.mediaFile.delete({ where: { id: fileId } });
  }
}
