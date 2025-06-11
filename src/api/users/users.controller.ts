import { RolesGuard } from '@api/auth/strategies/role.strategy'
import { PaginationQueryDto } from '@common/dto/pagination/pagination.query.dto'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseOnlyMessage } from 'src/helpers/custom-respone-message-only'
import { CreateAddressDto } from './dto/create-address.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schemas/user.entity'
import { UserResponseExample, UserResponseExampleList } from './user-type/res.user'
import { UsersService } from './users.service'

@ApiTags('users') // tag trùng với addTag ở trên
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    example: ResponseOnlyMessage(201, RESPONSE_MESSAGES.USER_MESSAGE.CREATED_SUCCESS)
  })
  @ApiBody({ type: CreateUserDto })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.CREATED_SUCCESS)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'List of users',
    type: [User],
    example: UserResponseExampleList
  })
  findAll(@Query() query: PaginationQueryDto) {
    const { current, limit, qs } = query
    return this.usersService.findAll(current, limit, qs || '')
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwtaccess'))
  @ApiOperation({ summary: 'Get a user by Id' })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: User,
    example: UserResponseExample
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @ApiOperation({ summary: 'Update a user by Id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPDATED_SUCCESS)
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOperation({ summary: 'Delete a user by Id' })
  @ApiResponse({
    status: 200,
    description: 'User delete successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.DELETE_SUCCESS)
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post(':id/addresses')
  @ApiOperation({ summary: 'Add new address for user' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({
    status: 201,
    description: 'Address added successfully',
    example: ResponseOnlyMessage(201, RESPONSE_MESSAGES.USER_MESSAGE.CTEATED_ADDRESS_SUCCESS)
  })
  createAddress(@Param('id') id: string, @Body() createAddressDto: CreateAddressDto) {
    return this.usersService.createAddress(id, createAddressDto)
  }

  @Patch(':id/addresses/:addressId')
  @ApiOperation({ summary: 'Update address for user by addressId' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPDATED_ADDRESS_SUCCESS)
  })
  updateAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    return this.usersService.updateAddress(id, addressId, updateAddressDto)
  }

  @Delete(':id/addresses/:addressId')
  @ApiOperation({ summary: 'Delete address by addressId' })
  @ApiResponse({
    status: 200,
    description: 'Address deleted successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.DELETED_ADDRESS_SUCCESS)
  })
  @UseGuards(AuthGuard('jwtaccess'), RolesGuard)
  removeAddress(@Param('id') id: string, @Param('addressId') addressId: string) {
    return this.usersService.removeAddress(id, addressId)
  }
}
