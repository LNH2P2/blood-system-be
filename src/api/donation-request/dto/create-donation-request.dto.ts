import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
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
    example: '6850cfd1effc21cd19654cd4'
  })
  @IsMongoId()
  @IsNotEmpty()
  hospitalId: string

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
