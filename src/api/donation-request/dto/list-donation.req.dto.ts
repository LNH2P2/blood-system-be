import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto'
import { DonationRequestPriority } from '@constants/donation.constant'
import { IsEnum, IsOptional } from 'class-validator'

export class ListDonationReqDto extends PageOptionsDto {
  @IsOptional()
  priority: DonationRequestPriority
}
