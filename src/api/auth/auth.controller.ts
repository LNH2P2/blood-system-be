import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { Public } from '@decorators/public.decorator'
import { ResponseMessage } from '@decorators/response-message.decorator'
import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ResponseOnlyMessage } from 'src/helpers/custom-respone-message-only'
import { AuthService } from './auth.service'
import { ChangePasswrodDto } from './dto/change-password.dto'
import { CreateAuthDto } from './dto/create-auth.dto'
import { ResetPasswrodDto } from './dto/reset-password.dto'
import { VerifyOtpDto } from './dto/verify.dto'
// import { Public } from '@decorators/public.decorator'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'user Login' })
  @ApiResponse({
    status: 200,
    description: 'User Login successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.LOGIN_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.LOGIN_SUCCESS)
  @ApiBody({ type: CreateAuthDto })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto.username, createAuthDto.password, createAuthDto.deviceInfo)
  }

  @Public()
  @Post('logout/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'user logout' })
  @ApiResponse({
    status: 200,
    description: 'User logout successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.LOGOUT_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.LOGOUT_SUCCESS)
  logout(@Param('userId') userId: string) {
    return this.authService.logout(userId)
  }

  @Public()
  @Post('change-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'user change password' })
  @ApiResponse({
    status: 200,
    description: 'User change password successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPADTE_PASSWORD)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.UPADTE_PASSWORD)
  @ApiBody({ type: ChangePasswrodDto })
  changePassword(@Body() updatePassword: ChangePasswrodDto) {
    return this.authService.changePassword(
      updatePassword.userId,
      updatePassword.oldPassword,
      updatePassword.newPassword
    )
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'user reset password' })
  @ApiResponse({
    status: 200,
    description: 'User reset password successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPADTE_PASSWORD)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.UPADTE_PASSWORD)
  @ApiBody({ type: ResetPasswrodDto })
  resetPassword(@Body() resetPassword: ResetPasswrodDto) {
    return this.authService.resetPassword(resetPassword.email, resetPassword.newPassword, resetPassword.otp)
  }

  @Public()
  @Post('refresh-token/:refreshToken')
  @HttpCode(200)
  @ApiOperation({ summary: 'user refresh token' })
  @ApiResponse({
    status: 200,
    description: 'User refresh token successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.REFRESH_TOKEN_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.REFRESH_TOKEN_SUCCESS)
  refreshtoken(@Param('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken)
  }

  @Public()
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

  @Public()
  @Post('resend-otp/:email')
  @Public()
  @ApiOperation({ summary: 'resend OTP' })
  @ApiResponse({
    status: 200,
    description: 'Resend OTP verified successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.RESEND_VERIFICATION_EMAIL_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.RESEND_VERIFICATION_EMAIL_SUCCESS)
  resendOtp(@Param('email') email: string) {
    return this.authService.resendVerificationEmail(email)
  }

  @Public()
  @Post('send-otp-reset-password/:email')
  @ApiOperation({ summary: 'send otp OTP' })
  @ApiResponse({
    status: 200,
    description: 'User OTP to reset successfully',
    example: ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.SEND_OTP_SUCCESS)
  })
  @ResponseMessage(RESPONSE_MESSAGES.USER_MESSAGE.SEND_OTP_SUCCESS)
  sendOtpResetPassword(@Param('email') email: string) {
    return this.authService.sendOtpForgotPassword(email)
  }
  //resendVerificationEmail
}
