import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ResponseOnlyMessage } from 'src/helpers/custom-respone-message-only'
import { USER_MESSAGE } from '@constant/message'
import { CreateUserDto } from '@api/users/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'user register' })
  @ApiResponse({
    status: 201,
    description: 'User register successfully',
    example: ResponseOnlyMessage(201, USER_MESSAGE.CREATED_SUCCESS)
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Get()
  findAll() {
    return this.authService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'verify OTP' })
  @ApiResponse({
    status: 200,
    description: 'User OTP verified successfully',
    example: ResponseOnlyMessage(200, USER_MESSAGE.VERIFY_SUCCESS)
  })
  authenticate(@Param('otp') otp: number, @Param('email') email: string) {
    return this.authService.authenOtpCodeWithEmail(email, otp)
  }
}
