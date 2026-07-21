import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional() @IsString() @IsOptional() avatarUrl?: string;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() emailNotifications?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() smsReminders?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() marketingUpdates?: boolean;
}

export class ChangePasswordDto {
  @ApiPropertyOptional() @IsString() @IsOptional() currentPassword?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() newPassword?: string;
}
