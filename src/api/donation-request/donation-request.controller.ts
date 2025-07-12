import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common'
import { DonationRequestService } from '@api/donation-request/donation-request.service'
import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { ListDonationReqDto } from '@api/donation-request/dto/list-donation.req.dto'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { Public } from '@decorators/public.decorator'
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'

@Controller('donation-requests')
@Public()
export class DonationRequestController {
  constructor(private readonly donationRequestService: DonationRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create donation request' })
  @ApiOkResponse({
    description: 'Donation request created successfully'
  })
  @ApiBody({ type: CreateDonationRequestDto })
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.CREATED)
  create(@Body() createDonationRequestDto: CreateDonationRequestDto) {
    return this.donationRequestService.create(createDonationRequestDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get list donation request of user ' })
  @ApiOkResponse({
    description: 'Get list donation request successfully'
  })
  @ApiQuery({ type: ListDonationReqDto })
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.LIST)
  findAll(@Query() listDonationReqDto: ListDonationReqDto, @Req() req: any) {
    console.log('req.user', req.user)
    // TODO: get userId from req.user
    return this.donationRequestService.findAll('6848f28cddd4f001f846e347', listDonationReqDto)
  }

  @Get('findAllHospital')
  @ApiOperation({ summary: 'Get all donation requests for hospital (for hospital dashboard)' })
  @ApiQuery({ type: ListDonationReqDto })
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.LIST)
  findAllHospital(@Query() listDonationReqDto: ListDonationReqDto) {
    console.log('listDonationReqDto', listDonationReqDto)
    return this.donationRequestService.findAllHospital(listDonationReqDto)
  }

  @Get(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.FOUND)
  findOne(@Param('id') id: string) {
    return this.donationRequestService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.UPDATED)
  update(@Param('id') id: string, @Body() updateDonationRequestDto: UpdateDonationRequestDto) {
    return this.donationRequestService.update(id, updateDonationRequestDto)
  }

  @Get('debug/hospitals')
  @ApiOperation({ summary: 'Debug: List hospitals' })
  listHospitals() {
    return this.donationRequestService.listHospitals()
  }

  @Delete(':id')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.DELETED)
  remove(@Param('id') id: string) {
    return this.donationRequestService.remove(id)
  }
}
