import { Module } from '@nestjs/common'
import { RefreshTokenService } from './refresh-token.service'
import { RefreshTokenController } from './refresh-token.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken } from './entities/refresh-token.entity'

@Module({
  imports: [RefreshTokenService, MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshToken }])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService, MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshToken }])]
})
export class RefreshTokenModule {}
