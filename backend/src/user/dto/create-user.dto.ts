import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma/client';

export class CreateUserDto {
  @ApiProperty() @IsString() @IsNotEmpty() fullName: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone: string;
  @ApiProperty() @IsString() @MinLength(6) password: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() email?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string;
  @ApiPropertyOptional({ enum: Role }) @IsEnum(Role) @IsOptional() role?: Role;
}
