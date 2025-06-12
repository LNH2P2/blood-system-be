import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ResponseOnlyMessage } from 'src/helpers/custom-respone-message-only'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { VerifyOtpDto } from './dto/verify.dto'
import { Public } from '@decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'user register' })
  @ApiResponse({
    status: 201,
    description: 'User register successfully',
    example: ResponseOnlyMessage(201, RESPONSE_MESSAGES.USER_MESSAGE.CREATED_SUCCESS)
  })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'user Login' })
  @ApiResponse({
    status: 200,
    description: 'User Login successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.LOGIN_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.LOGIN_SUCCESS)
  @ApiBody({ type: CreateAuthDto })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto.username, createAuthDto.password)
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
  @Public()
  @ApiOperation({ summary: 'verify OTP' })
  @ApiResponse({
    status: 200,
    description: 'User OTP verified successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.VERIFY_SUCCESS)
  })
  @ApiBody({ type: VerifyOtpDto })
  authenticate(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.authenOtpCodeWithEmail(verifyOtpDto.otp, verifyOtpDto.email)
  }

  @Post('resend-otp/:email')
  @Public()
  @ApiOperation({ summary: 'resend OTP' })
  @ApiResponse({
    status: 200,
    description: 'Resend OTP verified successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.RESEND_VERIFICATION_EMAIL_SUCCESS)
  })
  resendOtp(@Param('email') email: string) {
    return this.authService.resendVerificationEmail(email)
  }
  //resendVerificationEmail
}
