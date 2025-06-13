import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { ResponseMessage } from '../../decorators/response-message.decorator'
import { HospitalService } from './hospital.service'
import { CreateHospitalDto } from './dto/create-hospital.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto'
import { HospitalQueryDto } from './dto/hospital-query.dto'
import { Hospital } from './schemas/hospital.schema'
import { Public } from '../../decorators/public.decorator'
import { UpdateBloodInventoryDto, AddBloodInventoryDto } from './dto/blood-inventory.dto'

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new hospital (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Hospital created successfully',
    type: Hospital
  })
  @ApiBody({ type: CreateHospitalDto })
  @ResponseMessage('Hospital created successfully')
  create(@Body() createHospitalDto: CreateHospitalDto, @Request() req) {
    return this.hospitalService.create(createHospitalDto, req.user)
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all hospitals with search and filter' })
  @ApiOkResponse({
    description: 'List of hospitals',
    type: [Hospital]
  })
  findAll(@Query() query: HospitalQueryDto, @Request() req) {
    const currentUser = req.user || null
    return this.hospitalService.findAll(query, currentUser)
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiOkResponse({
    description: 'Hospital details',
    type: Hospital
  })
  findOne(@Param('id') id: string, @Request() req) {
    const currentUser = req.user || null
    return this.hospitalService.findOne(id, currentUser)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update hospital (Admin or Hospital Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital updated successfully',
    type: Hospital
  })
  @ApiBody({ type: UpdateHospitalDto })
  @ResponseMessage('Hospital updated successfully')
  update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto, @Request() req) {
    return this.hospitalService.update(id, updateHospitalDto, req.user)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete hospital (Admin only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital deleted successfully'
  })
  @ResponseMessage('Hospital deleted successfully')
  remove(@Param('id') id: string, @Request() req) {
    return this.hospitalService.remove(id, req.user)
  }

  @Put(':id/approve')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Approve hospital (Admin only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital approved successfully',
    type: Hospital
  })
  @ResponseMessage('Hospital approved successfully')
  approve(@Param('id') id: string, @Request() req) {
    return this.hospitalService.approve(id, req.user)
  }

  @Put(':id/reject')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Reject hospital (Admin only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Hospital rejected successfully',
    type: Hospital
  })
  @ResponseMessage('Hospital rejected successfully')
  reject(@Param('id') id: string, @Request() req) {
    return this.hospitalService.reject(id, req.user)
  }

  @Get(':id/blood-inventory')
  @Public()
  @ApiOperation({ summary: 'Get hospital blood inventory' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiOkResponse({
    description: 'Blood inventory details'
  })
  getBloodInventory(@Param('id') id: string, @Request() req) {
    const currentUser = req.user || null
    return this.hospitalService.findOne(id, currentUser)
  }

  @Put(':id/blood-inventory')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update hospital blood inventory (Hospital Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory updated successfully',
    type: Hospital
  })
  @ApiBody({ type: UpdateBloodInventoryDto })
  @ResponseMessage('Blood inventory updated successfully')
  updateBloodInventory(
    @Param('id') id: string,
    @Body() updateBloodInventoryDto: UpdateBloodInventoryDto,
    @Request() req
  ) {
    return this.hospitalService.updateBloodInventory(id, updateBloodInventoryDto.bloodInventory, req.user)
  }

  @Post(':id/blood-inventory')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add blood inventory item (Hospital Staff only)' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item added successfully',
    type: Hospital
  })
  @ApiBody({ type: AddBloodInventoryDto })
  @ResponseMessage('Blood inventory item added successfully')
  addBloodInventory(@Param('id') id: string, @Body() addBloodInventoryDto: AddBloodInventoryDto, @Request() req) {
    return this.hospitalService.addBloodInventory(id, addBloodInventoryDto.item, req.user)
  }
}
