import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CreateDonationMatchDto } from './dto/create-donation-match.dto'
import { UpdateDonationMatchDto } from './dto/update-donation-match.dto'
import { DonationRequestService } from '@api/donation-request/donation-request.service'

@Controller('donation-request')
export class DonationRequestController {
  constructor(private readonly donationRequestService: DonationRequestService) {}

  @Post()
  create(@Body() createDonationMatchDto: CreateDonationMatchDto) {
    return this.donationRequestService.create(createDonationMatchDto)
  }

  @Get()
  findAll() {
    return this.donationRequestService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationRequestService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationMatchDto: UpdateDonationMatchDto) {
    return this.donationRequestService.update(+id, updateDonationMatchDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationRequestService.remove(+id)
  }
}
