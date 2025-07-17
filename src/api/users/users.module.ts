import { HospitalModule } from '@api/hospital/hospital.module'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => HospitalModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
})
export class UsersModule {}
