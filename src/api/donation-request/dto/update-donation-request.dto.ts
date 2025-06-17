import { Hospital } from './../../hospital/schemas/hospital.schema'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class UpdateDonationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hospitalId: string

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  scheduleDate: Date
}
