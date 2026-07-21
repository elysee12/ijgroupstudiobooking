import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '+250788124555 or jane@example.com',
    description: 'Phone number or email address',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string; // phone OR email

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
