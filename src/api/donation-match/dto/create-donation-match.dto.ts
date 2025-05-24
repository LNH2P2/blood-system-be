import { Prop } from "@nestjs/mongoose";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DonationMatchStatus } from "src/constants/donation.constant";

export class CreateDonationMatchDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  donorId: string;

  @IsString()
  @IsNotEmpty()
  bloodBankId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(DonationMatchStatus)
  status: DonationMatchStatus;

  @IsDateString()
  @IsNotEmpty()
  scheduleDate: Date;

  @IsOptional()
  @IsDateString()
  completedDate?: Date;

  @IsOptional()
  @IsString()
  note?: string 
}
