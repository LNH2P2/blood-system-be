import { RefreshTokenService } from '@api/refresh-token/refresh-token.service'
import { EnumDeviceType } from '@api/refresh-token/types/enum'
import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { User, UserDocument } from '@api/users/schemas/user.entity'
import { UsersService } from '@api/users/users.service'
import { jwtConstants } from '@constants/app.constant'
import { ErrorCode } from '@constants/error-code.constant'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ValidationException } from '@exceptions/validattion.exception'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model, Types } from 'mongoose'
import parseTimeStringToMs from 'src/helpers/getTimeByText'
import RanDomNumber from 'src/helpers/otp-number'
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly refreshService: RefreshTokenService
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // 1. Tạo OTP ngẫu nhiên (6 chữ số)
      const otp = RanDomNumber()

      // 2. Gán thêm thông tin cần thiết
      const createUserDtoWithAuthen = {
        ...createUserDto,
        codeId: otp,
        codeExpired: new Date(Date.now() + 10 * 60 * 1000)
      }

      // 3. Tạo user trong DB (sử dụng hàm create hiện có)
      await this.userService.create(createUserDtoWithAuthen)

      // 5. Gửi email xác thực có OTP
      await this.sendEmailVerification(createUserDto.email, otp)

      // 6. Trả kết quả
      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Ném lại lỗi đã được xử lý
      }
      console.error('Register error:', error)
      throw error
    }
  }

  async login(username: string, password: string, deviceInfo: string) {
    // 1. Tìm người dùng theo email
    const user = await this.userModel.findOne({ username }).exec()

    if (!user) {
      throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
    }

    // 2. Kiểm tra mật khẩu (giả sử đã hash khi tạo user)
    const isPasswordMatching = await bcrypt.compare(password, user.password)
    if (!isPasswordMatching) {
      throw new ValidationException(ErrorCode.E009, RESPONSE_MESSAGES.USER_MESSAGE.WRONG_PASSWORD)
    }

    // 3. Kiểm tra nếu chưa xác thực email
    if (!user.verified) {
      throw new ValidationException(ErrorCode.E011, RESPONSE_MESSAGES.USER_MESSAGE.UNVERIFIED_EMAIL)
    }

    // 4. Tạo payload và JWT token
    const payload = { sub: user._id, email: user.email, username: user.username }
    const access_token = this.jwtService.sign(payload)

    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret_refresh,
      expiresIn: jwtConstants.expired_refresh
    })

    const refreshTokenData = {
      token: refresh_token,
      expiresAt: new Date(Date.now() + parseTimeStringToMs(jwtConstants.expired_refresh)),
      deviceInfo: deviceInfo as EnumDeviceType,
      user: user._id
    }
    // 5. Tạo refresh token trong DB
    const refresh = await this.refreshService.create(refreshTokenData)
    // 6. Cập nhật user với refreshTokenId nếu muốn lưu liên kết
    await this.userService.update(user._id.toString(), {
      refreshTokenId: refresh._id as Types.ObjectId
    })

    return {
      access_token: access_token,
      refresh_token: refresh_token
    }
  }

  /**
   * Resend verification email with OTP
   * @param email - User's email address
   */

  async resendVerificationEmail(email: string) {
    try {
      const OTP = RanDomNumber()
      await this.sendEmailVerification(email, OTP)
      await this.userService.updateOtp(email, OTP)
    } catch (error) {
      console.error('Error resending verification email:', error)
      throw new BadRequestException('Failed to resend verification email', error)
    }
  }

  /**
   * Gửi email xác thực với OTP
   * @param url - URL xác thực
   * @param email - Email người dùng
   * @param OTP - Mã OTP
   */
  async sendEmailVerification(email: string, OTP: number) {
    try {
      console.log('Sending email verification to:', email)

      await this.mailerService.sendMail({
        to: email,
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
        subject: 'Email Verification',
        template: 'verify-email', // email/templates/verify-email.hbs
        context: {
          user_email: email,
          otp_code: OTP
        }
      })
    } catch (error) {
      throw new BadRequestException('Invalid email format', error)
    }
  }

  /**
   * Xác thực mã OTP với email
   * @param email - Email người dùng
   * @param otpCode - Mã OTP được nhập
   */
  async authenOtpCodeWithEmail(otp: number, email: string) {
    try {
      console.log('Authenticating OTP code for email:', email, 'with code:', otp)
      // 1. Tìm người dùng theo email
      const user = await this.userModel.findOne({ email }).exec()
      if (!user) {
        throw new ValidationException(ErrorCode.E007, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }
      // 2. Kiểm tra mã OTP và thời gian hết hạn
      if (user.codeId !== otp || !user.codeExpired || user.codeExpired < new Date()) {
        throw new ValidationException(ErrorCode.E008, RESPONSE_MESSAGES.USER_MESSAGE.CODE_EXPIRED)
      }

      await this.userService.update(user._id.toString(), {
        verified: true,
        codeId: undefined, // Xóa mã OTP sau khi xác thực thành công
        codeExpired: undefined // Xóa thời gian hết hạn sau khi xác thực thành công
      })
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Giữ nguyên thông tin lỗi đã định nghĩa
      }
      console.error('Error authenticating OTP code:', error)
      throw new BadRequestException('Invalid OTP code or email', error)
    }
  }

  async refreshToken(token: string) {
    try {
      // 1. Giải mã token để lấy thông tin người dùng
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret_refresh
      })

      // 2. Tìm refresh token trong DB
      await this.refreshService.findByToken(token)

      // 3. Tạo access token mới
      const access_token = this.jwtService.sign({ sub: payload.sub, email: payload.email, username: payload.username })

      return { access_token: access_token }
    } catch (error) {
      console.error('Refresh token error:', error)
      throw new BadRequestException('Invalid refresh token', error)
    }
  }
}
