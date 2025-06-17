import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { ResponseMessage } from '../../decorators/response-message.decorator'
import { HospitalService } from './hospital.service'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
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
  findAll(@Query() query: HospitalQueryDto) {
    return this.hospitalService.findAll(query)
  }
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiOkResponse({
    description: 'Hospital details',
    type: Hospital
  })
  findOne(@Param('id') id: string) {
    return this.hospitalService.findOne(id)
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update hospital (Admin or Hospital Staff only)' })
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
  getBloodInventory(@Param('id') id: string) {
    return this.hospitalService.findOne(id)
  }

  @Put(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Update hospital blood inventory (Hospital Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory updated successfully',
    type: Hospital
  })
  @ApiBody({ type: UpdateBloodInventoryDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.ADD_BLOOD)
  updateBloodInventory(@Param('id') id: string, @Body() updateBloodInventoryDto: UpdateBloodInventoryDto) {
    return this.hospitalService.updateBloodInventory(id, updateBloodInventoryDto.bloodInventory)
  }

  @Post(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Add blood inventory item (Hospital Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item added successfully',
    type: Hospital
  })
  @ApiBody({ type: AddBloodInventoryDto })
  @ResponseMessage(RESPONSE_MESSAGES.HOSPITAL.ADD_BLOOD)
  addBloodInventory(@Param('id') id: string, @Body() addBloodInventoryDto: AddBloodInventoryDto) {
    return this.hospitalService.addBloodInventory(id, addBloodInventoryDto.item)
  }
}
