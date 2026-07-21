import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+250788124555 or jane@example.com',
    description: 'The same identifier used during login/register',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string; // phone OR email

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  code: string;
}
