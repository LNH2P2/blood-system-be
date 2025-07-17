import { DonationRequestService } from '@api/donation-request/donation-request.service'
import { CreateDonationRequestDto } from '@api/donation-request/dto/create-donation-request.dto'
import { ListDonationReqDto } from '@api/donation-request/dto/list-donation.req.dto'
import { UpdateDonationRequestDto } from '@api/donation-request/dto/update-donation-request.dto'
import { DonationRequestStatus } from '@constants/donation.constant'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { Public } from '@decorators/public.decorator'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger'

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

  //Admin, staff
  @Get('findAllHospital')
  @ApiOperation({ summary: 'Get all donation requests for hospital (for hospital dashboard)' })
  @ApiQuery({ type: ListDonationReqDto })
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.LIST)
  findAllHospital(@Query() listDonationReqDto: ListDonationReqDto) {
    console.log('listDonationReqDto', listDonationReqDto)
    return this.donationRequestService.findAllHospital(listDonationReqDto)
  }

  @Get('history-detailed')
  @Public()
  @ApiQuery({ name: 'year', required: false, type: String, description: 'Năm cần thống kê (mặc định là năm hiện tại)' })
  async getHistoryDetailed(@Query('year') year?: string) {
    const parsedYear = year ? parseInt(year) : undefined
    return this.donationRequestService.getDonationHistoryDetailed(parsedYear)
  }

  @Get('request-stats')
  @Public()
  async getRequestStats() {
    return this.donationRequestService.getRequestStats()
  }

  @Get('match-rate')
  @Public()
  @ApiQuery({ name: 'year', required: false, type: String, description: 'Năm cần thống kê (mặc định là năm hiện tại)' })
  async getMatchRate(@Query('year') year?: string) {
    const parsedYear = year ? parseInt(year) : new Date().getFullYear()
    return this.donationRequestService.getMatchRateData(parsedYear)
  }

  @Get('demand-report')
  @Public()
  async getDemandReport() {
    return this.donationRequestService.getDemandReport()
  }

  @Get('performance-report')
  @Public()
  async getPerformanceReport() {
    return this.donationRequestService.getPerformanceReport()
  }

  @Get('incident-report')
  @Public()
  async getIncidentReport() {
    return this.donationRequestService.getIncidentReport()
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

  @Patch(':id/status')
  @ResponseMessage(RESPONSE_MESSAGES.DONATION_REQUEST.UPDATED)
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: { status: DonationRequestStatus }) {
    return this.donationRequestService.updateStatus(id, updateStatusDto.status)
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
