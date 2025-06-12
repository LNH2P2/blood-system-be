import { RefreshTokenModule } from '@api/refresh-token/refresh-token.module'
import { UsersModule } from '@api/users/users.module'
import { jwtConstants } from '@constants/app.constant'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAccessStrategy } from './strategies/jwt-access.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
  imports: [
    UsersModule,
    RefreshTokenModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret_access,
      signOptions: { expiresIn: jwtConstants.expired_access }
    }),
    PassportModule
  ]
})
export class AuthModule {}
