import { Prop, Schema } from '@nestjs/mongoose'
import { BloodComponent, BloodType } from '@constants/hospital.constant'

@Schema({ _id: false })
export class BloodInventoryItem {
  @Prop({
    required: true,
    enum: Object.values(BloodType),
    type: String
  })
  bloodType: BloodType

  @Prop({
    required: true,
    enum: Object.values(BloodComponent),
    type: String
  })
  component: BloodComponent

  @Prop({ required: true, type: Number, min: 0 })
  quantity: number

  @Prop({ required: true, type: Date })
  expiresAt: Date
}
