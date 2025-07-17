import { RefreshTokenModule } from '@api/refresh-token/refresh-token.module'
import { UsersModule } from '@api/users/users.module'
import { jwtConstants } from '@constants/app.constant'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@api/users/schemas/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAccessStrategy } from './strategies/jwt-access.strategy'
import { JwtAccessAuthGuard } from '@api/auth/guard/auth-access.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtAccessAuthGuard],
  imports: [
    UsersModule,
    RefreshTokenModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret_access,
      signOptions: { expiresIn: jwtConstants.expired_access }
    }),
    PassportModule
  ],
  exports: [
    AuthService,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret_access,
      signOptions: { expiresIn: jwtConstants.expired_access }
    }),
    PassportModule
  ]
})
export class AuthModule {}
