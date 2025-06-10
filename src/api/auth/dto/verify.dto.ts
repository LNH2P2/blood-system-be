import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class VerifyOtpDto {
  @ApiProperty({ example: 'hehehe@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsNumber()
  otp: number
}
