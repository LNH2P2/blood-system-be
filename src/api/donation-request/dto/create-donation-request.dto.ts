import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator'
import { DonationRequestStatus, DonationRequestPriority } from 'src/constants/donation.constant'

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

  // Bổ sung các trường cho UI
  @ApiProperty({
    example: 'A+'
  })
  @IsString()
  @IsOptional()
  bloodType: string

  @ApiProperty({
    example: 2
  })
  @IsNumber()
  @IsOptional()
  quantity: number

  @ApiProperty({
    example: 'Cấp cứu'
  })
  @IsEnum(DonationRequestPriority)
  @IsOptional()
  priority: DonationRequestPriority = DonationRequestPriority.NORMAL

  @ApiProperty({
    example: 'Hà Nội'
  })
  @IsString()
  @IsOptional()
  location: string

  @ApiProperty({
    example: 'Nguyễn Văn A'
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string
}
