// refresh-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema({ timestamps: true, collection: 'RefreshToken' })
export class RefreshToken {
  @Prop({ required: true })
  token: string

  @Prop({ type: Date, required: true })
  expiresAt: Date

  @Prop()
  deviceInfo: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
