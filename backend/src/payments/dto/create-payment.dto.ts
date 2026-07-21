import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentType } from '../../../generated/prisma/client';

export class CreatePaymentDto {
  @ApiProperty() @IsInt() bookingId: number;
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) method: PaymentMethod;
  @ApiProperty({ enum: PaymentType }) @IsEnum(PaymentType) type: PaymentType;
  @ApiPropertyOptional() @IsString() @IsOptional() mobilePhone?: string;
}
