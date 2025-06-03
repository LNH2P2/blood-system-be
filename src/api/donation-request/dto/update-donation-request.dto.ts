import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateDonationRequestDto extends PartialType(CreateDonationRequestDto) {}
