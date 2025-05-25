import { PartialType } from '@nestjs/swagger'
import { CreateDonationMatchDto } from './create-donation-match.dto'

export class UpdateDonationMatchDto extends PartialType(CreateDonationMatchDto) {}
