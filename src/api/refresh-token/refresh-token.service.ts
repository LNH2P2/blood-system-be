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
      const refreshToken = new this.refreshTokenModel({
        token: createRefreshTokenDto.token,
        expiresAt: createRefreshTokenDto.expiresAt,
        deviceInfo: createRefreshTokenDto.deviceInfo,
        user: createRefreshTokenDto.user
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
