import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger'
import { BloodInventoryService } from './blood-inventory.service'
import { CreateBloodInventoryDto } from './dto/create-blood-inventory.dto'
import { UpdateBloodInventoryDto } from './dto/update-blood-inventory.dto'
import { ListBloodInventoryDto } from './dto/list-blood-inventory.req.dto'
import { Public } from '@decorators/public.decorator'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { BloodType } from '@constants/hospital.constant'

@ApiTags('blood-inventory')
@Controller('blood-inventory')
@Public()
export class BloodInventoryController {
  constructor(private readonly bloodInventoryService: BloodInventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blood inventory item' })
  @ApiResponse({
    status: 201,
    description: 'Blood inventory item created successfully'
  })
  @ApiBody({ type: CreateBloodInventoryDto })
  @ResponseMessage('Blood inventory item created successfully')
  create(@Body() createBloodInventoryDto: CreateBloodInventoryDto) {
    return this.bloodInventoryService.create(createBloodInventoryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all blood inventory items with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of blood inventory items'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search query' })
  @ApiQuery({
    name: 'bloodType',
    required: false,
    enum: BloodType,
    description: 'Filter by blood type'
  })
  @ApiQuery({
    name: 'component',
    required: false,
    enum: ['WHOLE_BLOOD', 'RED_CELLS', 'PLATELETS', 'PLASMA', 'CRYOPRECIPITATE'],
    description: 'Filter by blood component'
  })
  @ApiQuery({ name: 'province', required: false, type: String, description: 'Filter by province/city' })
  @ApiQuery({ name: 'district', required: false, type: String, description: 'Filter by district' })
  @ApiQuery({ name: 'ward', required: false, type: String, description: 'Filter by ward/commune' })
  @ApiQuery({
    name: 'address',
    required: false,
    type: String,
    description: 'Filter by hospital address (partial match)'
  })
  @ResponseMessage('Blood inventory items retrieved successfully')
  findAll(@Query() query: ListBloodInventoryDto) {
    return this.bloodInventoryService.findAll(query)
  }

  @Get('hospital/:hospitalId')
  @ApiOperation({ summary: 'Get blood inventory items by hospital ID' })
  @ApiParam({ name: 'hospitalId', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory items for the specified hospital'
  })
  @ResponseMessage('Hospital blood inventory retrieved successfully')
  findByHospital(@Param('hospitalId') hospitalId: string) {
    return this.bloodInventoryService.findByHospital(hospitalId)
  }

  @Get('expired/cleanup')
  @ApiOperation({ summary: 'Remove expired blood inventory items' })
  @ApiResponse({
    status: 200,
    description: 'Expired items removed successfully'
  })
  @ResponseMessage('Expired blood inventory items removed')
  removeExpiredItems() {
    return this.bloodInventoryService.removeExpiredItems()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blood inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Blood inventory item ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item details'
  })
  @ApiResponse({
    status: 404,
    description: 'Blood inventory item not found'
  })
  @ResponseMessage('Blood inventory item retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.bloodInventoryService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blood inventory item' })
  @ApiParam({ name: 'id', description: 'Blood inventory item ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Blood inventory item not found'
  })
  @ApiBody({ type: UpdateBloodInventoryDto })
  @ResponseMessage('Blood inventory item updated successfully')
  update(@Param('id') id: string, @Body() updateBloodInventoryDto: UpdateBloodInventoryDto) {
    return this.bloodInventoryService.update(id, updateBloodInventoryDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blood inventory item' })
  @ApiParam({ name: 'id', description: 'Blood inventory item ID' })
  @ApiResponse({
    status: 200,
    description: 'Blood inventory item deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Blood inventory item not found'
  })
  @ResponseMessage('Blood inventory item deleted successfully')
  remove(@Param('id') id: string) {
    return this.bloodInventoryService.remove(id)
  }
}
