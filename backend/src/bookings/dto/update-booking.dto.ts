import { IsString, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../../../generated/prisma/client';

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  estimatedAmount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  finalAmount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  depositAmount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  brief?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  eventDate?: string;
}
