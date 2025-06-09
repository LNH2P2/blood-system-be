import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { User, UserDocument } from '@api/users/schemas/user.entity'
import { UsersService } from '@api/users/users.service'
import { ErrorCode } from '@constant/error-code.constant'
import { USER_MESSAGE } from '@constant/message'
import { ValidationException } from '@exceptions/validattion.exception'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import RanDomNumber from 'src/helpers/otp-number'
import { UpdateAuthDto } from './dto/update-auth.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService
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
      return {
        statusCode: 201,
        message: USER_MESSAGE.CREATED_SUCCESS
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Ném lại lỗi đã được xử lý
      }
      console.error('Register error:', error)
      throw error
    }
  }

  findAll() {
    return `This action returns all auth`
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
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
  async authenOtpCodeWithEmail(email: string, otpCode: number) {
    try {
      // 1. Tìm người dùng theo email
      const user = await this.userModel.findOne({ email }).exec()
      if (!user) {
        throw new ValidationException(ErrorCode.E007, USER_MESSAGE.NOT_FOUND)
      }
      // 2. Kiểm tra mã OTP và thời gian hết hạn
      if (user.codeId !== otpCode || !user.codeExpired || user.codeExpired < new Date()) {
        throw new ValidationException(ErrorCode.E008, USER_MESSAGE.CODE_EXPIRED)
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
}
