// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { Gender, UserRole } from '../user-type/enum/user.enum'
import { Address, AddressSchema } from './address.entity'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({ required: true })
  fullName: string

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({
    type: String,
    default: 'https://img.freepik.com/premium-vector/free-vector-user-icon-simple-line_901408-588.jpg'
  })
  image: string

  @Prop({ enum: UserRole, type: String, default: UserRole.Member })
  role: UserRole

  @Prop({ enum: Gender, type: String, default: Gender.Other })
  gender: Gender

  @Prop({ type: Date })
  dateOfBirth: Date

  @Prop({ type: [AddressSchema], default: [] })
  address: Address[]

  @Prop()
  accountType: string

  @Prop({ type: String, default: null })
  bloodType: string | null

  // Dùng reference đến RefreshToken
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'RefreshToken' }], default: {} })
  refreshTokenId: Types.ObjectId

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: false })
  verified: boolean

  @Prop()
  codeId: number

  @Prop({ type: Date, required: false, default: null })
  codeExpired: Date | null

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User', default: null },
      email: { type: String, default: null }
    },
    default: null
  })
  createdAtBy: {
    _id: Types.ObjectId
    email: string
  }

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User' },
      email: { type: String }
    },
    default: null
  })
  updatedAtBy: {
    _id: Types.ObjectId
    email: string
  }

  @Prop({
    type: {
      _id: { type: SchemaTypes.ObjectId, ref: 'User' },
      email: { type: String }
    },
    default: null
  })
  isDeletedBy: {
    _id: Types.ObjectId
    email: string
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
