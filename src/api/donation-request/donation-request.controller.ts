import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { DonationRequestService } from '@api/donation-request/donation-request.service'
import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { RESPONSE_MESSAGES } from 'src/constants/response-messages.constant'

@Controller('donation-request')
export class DonationRequestController {
  constructor(private readonly donationRequestService: DonationRequestService) {}

  @Post()
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.CREATED)
  create(@Body() createDonationRequestDto: CreateDonationRequestDto) {
    return this.donationRequestService.create(createDonationRequestDto)
  }

  @Get()
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.LIST)
  findAll() {
    return this.donationRequestService.findAll()
  }

  @Get(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.FOUND)
  findOne(@Param('id') id: string) {
    return this.donationRequestService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.UPDATED)
  update(@Param('id') id: string, @Body() updateDonationRequestDto: UpdateDonationRequestDto) {
    return this.donationRequestService.update(+id, updateDonationRequestDto)
  }

  @Delete(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.DELETED)
  remove(@Param('id') id: string) {
    return this.donationRequestService.remove(+id)
  }
}
