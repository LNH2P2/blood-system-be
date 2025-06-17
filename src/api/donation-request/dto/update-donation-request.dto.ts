import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class UpdateDonationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hospitalId: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  scheduleDate: Date
}
