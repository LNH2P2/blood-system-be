import { ErrorCode } from '@constants/error-code.constant'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ValidationException } from '@exceptions/validattion.exception'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto'
import { RefreshToken, RefreshTokenDocument } from './entities/refresh-token.entity'

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>
  ) {}
  async create(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshTokenDocument> {
    try {
      const { token, expiresAt, deviceInfo, user } = createRefreshTokenDto

      // Kiểm tra xem user đã có token cho device này chưa
      const existingToken = await this.refreshTokenModel.findOne({
        user,
        deviceInfo
      })

      if (existingToken) {
        // Cập nhật token + thời hạn
        existingToken.token = token
        existingToken.expiresAt = expiresAt
        return await existingToken.save()
      }

      // Tạo token mới
      const refreshToken = new this.refreshTokenModel({
        token,
        expiresAt,
        deviceInfo,
        user
      })

      return await refreshToken.save()
    } catch (error) {
      console.error('Error creating refresh token:', error)
      throw new Error('Failed to create refresh token')
    }
  }

  async findByToken(token: string): Promise<RefreshTokenDocument | void> {
    try {
      const findRefreshToken = await this.refreshTokenModel.findOne({ token }).exec()
      if (!findRefreshToken) {
        throw new ValidationException(ErrorCode.E011, RESPONSE_MESSAGES.USER_MESSAGE.TOKEN_NOT_FOUND)
      }
      const tokenExpired = findRefreshToken.expiresAt < new Date()
      if (tokenExpired) {
        throw new ValidationException(ErrorCode.E013, RESPONSE_MESSAGES.USER_MESSAGE.TOKEN_EXPIRED)
      }
      return findRefreshToken
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error // Re-throw the validation exception
      }
      console.error('Error finding refresh token:', error)
      throw new Error('Failed to find refresh token')
    }
  }
}
