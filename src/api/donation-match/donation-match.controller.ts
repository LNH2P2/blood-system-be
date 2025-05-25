import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { DonationMatchService } from './donation-match.service'
import { CreateDonationMatchDto } from './dto/create-donation-match.dto'
import { UpdateDonationMatchDto } from './dto/update-donation-match.dto'

@Controller('donation-match')
export class DonationMatchController {
  constructor(private readonly donationMatchService: DonationMatchService) {}

  @Post()
  create(@Body() createDonationMatchDto: CreateDonationMatchDto) {
    return this.donationMatchService.create(createDonationMatchDto)
  }

  @Get()
  findAll() {
    return this.donationMatchService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationMatchService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationMatchDto: UpdateDonationMatchDto) {
    return this.donationMatchService.update(+id, updateDonationMatchDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationMatchService.remove(+id)
  }
}
