import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShootType } from '../../../generated/prisma/client';

export class CreateBookingDto {
  @ApiProperty({ description: 'Service ID from the service catalog' })
  @IsInt()
  serviceId: number;

  @ApiProperty({ enum: ShootType })
  @IsEnum(ShootType)
  shootType: ShootType;

  @ApiProperty({ example: '2026-06-12T09:00:00.000Z' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 'Kigali Serena Hotel' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 'Full-day wedding coverage...' })
  @IsString()
  @IsOptional()
  brief?: string;

  @ApiPropertyOptional({ description: 'Customer full name (if not authenticated)' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Customer phone (if not authenticated)' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Add-on IDs to attach' })
  @IsArray()
  @IsOptional()
  addOnIds?: number[];
}
