import { FindAllResult } from '@common/dto/pagination/pagination.list.dto'
import { RESPONSE_MESSAGES } from '@constants/response-messages.constant'
import { ValidateObjectId, ValidationException } from '@exceptions/validattion.exception'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import aqp from 'api-query-params'
import { Model } from 'mongoose'
import { ErrorCode } from 'src/constants/error-code.constant'
import { ResponseOnlyMessage } from 'src/helpers/custom-respone-message-only'
import HashPassword from 'src/helpers/hash-password'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Address } from './schemas/address.entity'
import { User, UserDocument } from './schemas/user.entity'
import { IsCreatedBy } from './user-type/enum/user.enum'
import RanDomNumber from 'src/helpers/otp-number'
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      await validateUniqueUserFields(
        this.userModel,
        createUserDto.email,
        createUserDto.username,
        createUserDto.phoneNumber
      )

      const passwordHash = await HashPassword(createUserDto.password)

      // Kiểm tra xem người dùng có được tạo bởi admin hay không
      const isAdminCreate = createUserDto.isCreatedBy === IsCreatedBy.system

      const createdUser = new this.userModel({
        // ✅ Thông tin cá nhân
        email: createUserDto.email,
        phoneNumber: createUserDto.phoneNumber,
        fullName: createUserDto.fullName,
        username: createUserDto.username,
        password: passwordHash,
        image: createUserDto.image,
        gender: createUserDto.gender,
        dateOfBirth: createUserDto.dateOfBirth,
        address: [createUserDto.address],

        // ✅ Tài khoản
        role: createUserDto.role,
        accountType: createUserDto.accountType,
        isActive: true,
        isDeleted: false,
        verified: isAdminCreate ? true : false,

        // ✅ Mã xác thực nếu gửi OTP
        codeId: createUserDto.codeId || null,
        codeExpired: createUserDto.codeExpired || null,

        // ✅ Liên quan người tạo
        createdAtBy: {
          _id: createUserDto.createdBy?._id || null,
          email: createUserDto.createdBy?.email || null
        },

        // ✅ Có thể để trống khi tạo
        updatedAtBy: null,
        isDeletedBy: null,

        // ✅ Refresh tokens (tạo mới nên là [])
        refreshTokens: []
      })

      await createdUser.save()

      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }

      console.error('Error creating user:', error)
      throw new InternalServerErrorException('Error creating user')
    }
  }

  async findAll(currentPage: number, limit: number, qs: string): Promise<FindAllResult<User>> {
    const { filter, sort, population } = aqp(qs)
    delete filter.current
    delete filter.limit

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit || 10

    const totalItems = await this.userModel.find(filter).countDocuments()
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password -refreshTokens')
      .populate(population)
      // .populate({ path: 'donationHistories', select: { name: 1, _id: 1 } })
      .exec()

    const response: FindAllResult<User> = {
      message: RESPONSE_MESSAGES.USER_MESSAGE.GET_ALL_SUCCESS,
      data: {
        meta: {
          current: currentPage,
          limit: defaultLimit,
          pages: totalPages,
          total: totalItems
        },
        result
      }
    }
    return response
  }

  async findOne(id: string) {
    try {
      ValidateObjectId(id)
      await checkUserWithId(id, this.userModel)
      const user = await this.userModel
        .findById(id)
        .select('-password -refreshTokens')
        // .populate('createdAtBy', 'email _id')
        .exec()
      return user
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error get user:', error)
      throw new InternalServerErrorException('Error get user')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      ValidateObjectId(id)
      await checkUserWithId(id, this.userModel)

      if (updateUserDto.password) {
        throw new ValidationException(ErrorCode.E005, RESPONSE_MESSAGES.USER_MESSAGE.CAN_NOT_CHANGE_PASSWORD)
      }

      if (updateUserDto.email || updateUserDto.username || updateUserDto.phoneNumber) {
        await validateUniqueUserFields(
          this.userModel,
          updateUserDto.email ?? '',
          updateUserDto.username ?? '',
          updateUserDto.phoneNumber ?? ''
        )
      }

      await this.userModel.findByIdAndUpdate(id, { $set: updateUserDto }, { new: true, runValidators: true })

      return ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPDATED_SUCCESS)
    } catch (error) {
      // Kiểm tra nếu lỗi là ValidationException
      if (error instanceof ValidationException) {
        throw error
      }

      console.error('Error updating user:', error)
      throw new InternalServerErrorException('Error updating user')
    }
  }

  async updateOtp(email: string, otp: number) {
    try {
      // Kiểm tra xem email có hợp lệ không
      if (!email) {
        throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.EMAIL_NOT_EXISTED)
      }

      // Tìm người dùng theo email
      const user = await this.userModel.findOne({ email })

      // Nếu không tìm thấy người dùng, ném lỗi
      if (!user) {
        throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
      }

      // Cập nhật mã OTP và thời gian hết hạn
      const codeId = otp
      const codeExpired = new Date(Date.now() + 5 * 60 * 1000) // Hết hạn sau 5 phút

      user.codeId = codeId
      user.codeExpired = codeExpired

      await user.save()

      return
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error updating OTP:', error)
      throw new InternalServerErrorException('Error updating OTP')
    }
  }

  async remove(id: string) {
    try {
      ValidateObjectId(id)
      await checkUserWithId(id, this.userModel)
      await this.userModel.findByIdAndDelete(id)
      return ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.DELETE_SUCCESS)
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error deleting user:', error)
      throw new InternalServerErrorException('Error deleting user')
    }
  }

  async createAddress(id: string, newAddress: Address) {
    try {
      // Validate userId hợp lệ và tồn tại
      ValidateObjectId(id)
      await checkUserWithId(id, this.userModel)

      const updatedUser = await this.userModel.findByIdAndUpdate(id, { $push: { address: newAddress } }, { new: true })
      return updatedUser
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error createAddress user:', error)
      throw new InternalServerErrorException('Error createAddress user')
    }
  }

  async updateAddress(id: string, addressId: string, updatedData: Partial<Address>) {
    try {
      // Validate userId và addressId hợp lệ
      ValidateObjectId(id)
      ValidateObjectId(addressId)

      await checkUserWithId(id, this.userModel)
      await this.userModel.findOneAndUpdate(
        { _id: id, 'address._id': addressId },
        {
          $set: {
            'address.$.street': updatedData.street,
            'address.$.district': updatedData.district,
            'address.$.city': updatedData.city,
            'address.$.nation': updatedData.nation
          }
        },
        { new: true }
      )
      return ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.UPDATED_ADDRESS_SUCCESS)
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error updateAddress user:', error)
      throw new InternalServerErrorException('Error updateAddress user')
    }
  }

  async removeAddress(id: string, addressId: string) {
    try {
      // Validate userId và addressId hợp lệ
      ValidateObjectId(id)
      ValidateObjectId(addressId)

      await checkUserWithId(id, this.userModel)

      await this.userModel.findByIdAndUpdate(id, { $pull: { address: { _id: addressId } } }, { new: true })
      return ResponseOnlyMessage(200, RESPONSE_MESSAGES.USER_MESSAGE.DELETED_ADDRESS_SUCCESS)
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      console.error('Error removeAddress user:', error)
      throw new InternalServerErrorException('Error removeAddress user')
    }
  }
}

export async function validateUniqueUserFields(
  userModel: Model<UserDocument>,
  email: string,
  username: string,
  phoneNumber: string
): Promise<void> {
  // if (!email || !username || !phoneNumber) {
  //   throw new ValidationException(ErrorCode.E001, USER_MESSAGE.EMAIL_USERNAME_PASSWORD_IS_NULL)
  // }
  const existingUser = await userModel.findOne({
    $or: [{ email: email }, { username: username }, { phoneNumber: phoneNumber }]
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ValidationException(ErrorCode.E001, RESPONSE_MESSAGES.USER_MESSAGE.EMAIL_EXISTED)
    }

    if (existingUser.username === username) {
      throw new ValidationException(ErrorCode.E001, RESPONSE_MESSAGES.USER_MESSAGE.USERNAME_EXISTED)
    }

    if (existingUser.phoneNumber === phoneNumber) {
      throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.PHONE_NUMBER_EXISTED)
    }
  }
}

export async function checkUserWithId(id: string, userModel: Model<UserDocument>) {
  const user = await userModel.findById(id)
  if (!user) {
    throw new ValidationException(ErrorCode.E002, RESPONSE_MESSAGES.USER_MESSAGE.NOT_FOUND)
  }
}
