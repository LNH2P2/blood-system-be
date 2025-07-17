import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { ResponseMessage } from '../../decorators/response-message.decorator'
import { HospitalService } from './hospital.service'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { NearbyHospitalsQueryDto } from './dto/nearby-hospitals-query.dto'
import { Hospital } from './schemas/hospital.schema'
import { Public } from '../../decorators/public.decorator'
import { UpdateBloodInventoryDto, AddBloodInventoryDto } from './dto/blood-inventory.dto'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new hospital (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Hospital created successfully',
    type: Hospital
  })
  @ApiBody({ type: CreateHospitalDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.CREATED)
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalService.create(createHospitalDto)
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all hospitals with search and filter' })
  @ApiOkResponse({
    description: 'List of hospitals',
    type: [Hospital]
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.LIST)
  findAll(@Query() query: HospitalQueryDto) {
    return this.hospitalService.findAll(query)
  }

  @Get('nearby')
  @Public()
  @ApiOperation({ summary: 'Find nearby hospitals within radius' })
  @ApiOkResponse({
    description: 'Nearby hospitals retrieved successfully',
    type: [Hospital]
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.NEARBY_HOSPITALS)
  findNearby(@Query() query: NearbyHospitalsQueryDto) {
    return this.hospitalService.findNearby(query.latitude, query.longitude, query.radius)
  }

  @Get('blood-inventory/summary')
  @Public()
  @ApiOperation({ summary: 'Get blood inventory summary across all hospitals' })
  @ApiOkResponse({
    description: 'Blood inventory summary retrieved successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.BLOOD_SUMMARY)
  getBloodInventorySummary() {
    return this.hospitalService.getBloodInventorySummary()
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiOkResponse({
    description: 'Hospital details',
    type: Hospital
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.FOUND)
  findOne(@Param('id') id: string) {
    return this.hospitalService.findOne(id)
  }

  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Update hospital (Admin only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital updated successfully',
    type: Hospital
  })
  @ApiBody({ type: UpdateHospitalDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.UPDATED)
  update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalService.update(id, updateHospitalDto)
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete hospital (Admin only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital deleted successfully'
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.DELETED)
  remove(@Param('id') id: string) {
    return this.hospitalService.remove(id)
  }

  @Get(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Get hospital blood inventory' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiOkResponse({
    description: 'Blood inventory details'
  })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.BLOOD_INVENTORY_FOUND)
  getBloodInventory(@Param('id') id: string) {
    return this.hospitalService.findOne(id)
  }

  @Put(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Update hospital blood inventory (Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory updated successfully',
    type: Hospital
  })
  @ApiBody({ type: UpdateBloodInventoryDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.UPDATE_BLOOD_INVENTORY)
  updateBloodInventory(@Param('id') id: string, @Body() updateBloodInventoryDto: UpdateBloodInventoryDto) {
    return this.hospitalService.updateBloodInventory(id, updateBloodInventoryDto.bloodInventory)
  }

  @Post(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Add blood inventory item (Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item added successfully',
    type: Hospital
  })
  @ApiBody({ type: AddBloodInventoryDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.ADD_BLOOD_INVENTORY)
  addBloodInventory(@Param('id') id: string, @Body() addBloodInventoryDto: AddBloodInventoryDto) {
    return this.hospitalService.addBloodInventory(id, addBloodInventoryDto.item)
  }
}
