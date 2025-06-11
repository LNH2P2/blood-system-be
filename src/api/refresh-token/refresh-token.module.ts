import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenSchema } from './entities/refresh-token.entity'
import { RefreshTokenController } from './refresh-token.controller'
import { RefreshTokenService } from './refresh-token.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService, MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshToken }])]
})
export class RefreshTokenModule {}
