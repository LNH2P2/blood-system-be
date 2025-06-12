import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { DonationRequestStatus } from 'src/constants/donation.constant'

export class CreateDonationRequestDto {
  @ApiProperty({
    example: 'REQ-20250603-003'
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    example: DonationRequestStatus.SCHEDULED
  })
  @IsEnum(DonationRequestStatus)
  @IsOptional()
  status: DonationRequestStatus = DonationRequestStatus.SCHEDULED

  @ApiProperty({
    example: 'MED-20250603-001'
  })
  @IsString()
  @IsNotEmpty()
  medicalFacilityId: string

  @ApiProperty({
    example: '2025-10-01T10:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  scheduleDate: Date

  @ApiProperty({
    example: 'Notes about the donation request',
    required: false
  })
  @IsOptional()
  @IsString()
  note?: string
}
