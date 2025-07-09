import { RefreshToken, RefreshTokenDocument } from '@api/refresh-token/entities/refresh-token.entity'
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
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model, Types } from 'mongoose'
import parseTimeStringToMs from 'src/helpers/getTimeByText'
import RanDomNumber from 'src/helpers/otp-number'
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshModel: Model<RefreshTokenDocument>,
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
      throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.USERNAME_OR_PASSWORD_IS_WRONG)
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
    const payload = { sub: user._id, email: user.email, username: user.username, image: user.image, role: user.role }
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
  async logout(userId: string) {
    try {
      const checkUser = await this.userModel.findById(userId).exec()
      if (!checkUser) {
        throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }

      const refreshTokenData = await this.refreshModel.findOne({ user: checkUser._id })
      if (refreshTokenData) {
        await this.refreshService.deleteRefreshToken(refreshTokenData._id)
      }

      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Re-throw the validation exception
      }
      console.error('Logout error:', error)
      throw new InternalServerErrorException('Logout failed')
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      const checkUser = await this.userModel.findById(userId).exec()
      if (!checkUser) {
        throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }
      // 1. Kiểm tra mật khẩu cũ
      const isPasswordMatching = await bcrypt.compare(oldPassword, checkUser.password)
      if (!isPasswordMatching) {
        throw new ValidationException(ErrorCode.E016, RESPONSE_MESSAGES.USER_MESSAGE.WRONG_PASSWORD)
      }

      // 2. Kiểm tra mật khẩu mới không được giống mật khẩu cũ
      const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, checkUser.password)
      if (isNewPasswordSameAsOld) {
        throw new ValidationException(ErrorCode.E017, RESPONSE_MESSAGES.USER_MESSAGE.PASSWORD_IS_SAME_AS_OLD)
      }
      await this.userService.updatePassword(userId, newPassword)
      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Re-throw the validation exception
      }
      console.error('Change password error:', error)
      throw new InternalServerErrorException('Change password failed')
    }
  }

  async resetPassword(email: string, newPassword: string, otp: number) {
    try {
      const user = await this.userModel.findOne({ email }).exec()
      if (!user) {
        throw new ValidationException(ErrorCode.E007, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }

      // 1. Kiểm tra mã OTP
      if (user.codeId !== otp) {
        throw new ValidationException(ErrorCode.E012, RESPONSE_MESSAGES.USER_MESSAGE.TOKEN_NOT_FOUND)
      }

      // 2. Kiểm tra thời gian hết hạn
      if (!user.codeExpired || user.codeExpired < new Date()) {
        throw new ValidationException(ErrorCode.E008, RESPONSE_MESSAGES.USER_MESSAGE.CODE_EXPIRED)
      }

      // 4. Cập nhật mật khẩu + xóa OTP
      await this.userService.updatePassword(user._id.toString(), newPassword)

      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Reset password error:', error)
      throw new InternalServerErrorException('Reset password failed')
    }
  }

  async sendOtpForgotPassword(email: string) {
    try {
      if (!email) {
        throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.EMAIL_NOT_EXISTED)
      }
      const user = await this.userModel.findOne({ email }).exec()
      if (!user) {
        throw new ValidationException(ErrorCode.E007, RESPONSE_MESSAGES.USER_MESSAGE.EMAIL_NOT_EXISTED)
      }

      const otp = RanDomNumber() // 6 chữ số

      await this.userService.updateOtp(email, otp)
      await this.sendEmailVerification(email, otp)

      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Re-throw the validation exception
      }
      console.error('Send OTP for forgot password error:', error)
      throw new InternalServerErrorException('Failed to send OTP for forgot password')
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
      this.logger.log(`Verification email sent to ${email}`)
    } catch (error) {
      this.logger.warn(`Failed to send verification email to ${email}: ${error?.message}`)
      // Không throw nữa nếu bạn không muốn hiện màu đỏ
      // Nếu cần throw (ví dụ cho Controller biết), hãy throw CustomException không gây ERROR trong console
    }
  }

  /**
   * Xác thực mã OTP với email
   * @param email - Email người dùng
   * @param otpCode - Mã OTP được nhập
   */
  async authenOtpCodeWithEmail(otp: number, email: string) {
    try {
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

  async refreshToken(refreshToken: string) {
    try {
      // 1. Giải mã token để lấy payload
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret_refresh
      })

      // 2. Tìm refresh token trong DB
      const refreshTokenDoc = await this.refreshService.findByToken(refreshToken)
      if (!refreshTokenDoc) {
        throw new ValidationException(ErrorCode.E014, RESPONSE_MESSAGES.USER_MESSAGE.TOKEN_NOT_FOUND)
      }

      // 3. Kiểm tra hạn của refresh token
      if (!refreshTokenDoc.expiresAt || refreshTokenDoc.expiresAt < new Date()) {
        throw new ValidationException(ErrorCode.E008, RESPONSE_MESSAGES.USER_MESSAGE.TOKEN_EXPIRED)
      }

      // 4. Kiểm tra user có tồn tại không
      const user = await this.userModel.findById(payload.sub).exec()
      if (!user) {
        throw new ValidationException(ErrorCode.E007, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }

      // 5. Tạo access token mới
      const access_token = this.jwtService.sign({
        sub: user._id,
        email: user.email,
        username: user.username,
        image: user.image,
        role: user.role
      })

      return { access_token }
    } catch (error) {
      console.error('Refresh token error:', error)
      if (error instanceof ValidationException) {
        throw error
      }
      throw new BadRequestException('Invalid or expired refresh token', error)
    }
  }
}
