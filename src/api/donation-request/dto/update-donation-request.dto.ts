import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString, IsNumber, IsEnum, IsMongoId, IsOptional } from 'class-validator'
import { DonationRequestStatus, DonationRequestPriority } from 'src/constants/donation.constant'

export class UpdateDonationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hospitalId: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  scheduleDate: Date

  // Bổ sung các trường cho UI
  @ApiProperty({ example: 'A+' })
  @IsString()
  @IsNotEmpty()
  bloodType: string

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    example: DonationRequestPriority.NORMAL,
    enum: DonationRequestPriority,
    default: DonationRequestPriority.NORMAL
  })
  @IsEnum(DonationRequestPriority)
  @IsOptional()
  priority?: DonationRequestPriority = DonationRequestPriority.NORMAL

  @ApiProperty({ example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  location: string

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  createdBy: string

  @ApiProperty({ example: DonationRequestStatus.SCHEDULED })
  @IsEnum(DonationRequestStatus)
  @IsOptional()
  status?: DonationRequestStatus

  @ApiProperty({ example: 'Notes about the donation request', required: false })
  @IsOptional()
  @IsString()
  note?: string
}
