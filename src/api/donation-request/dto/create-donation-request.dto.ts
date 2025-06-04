import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { DonationRequestStatus } from 'src/constants/donation.constant'

export class CreateDonationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(DonationRequestStatus)
  @IsOptional()
  status: DonationRequestStatus = DonationRequestStatus.SCHEDULED

  @IsString()
  @IsNotEmpty()
  medicalFacilityId: string

  @IsDateString()
  @IsNotEmpty()
  scheduleDate: Date

  @IsOptional()
  @IsString()
  note?: string
}
