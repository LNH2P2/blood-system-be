import { jwtConstants } from '@constants/app.constant'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../../users/schemas/user.entity'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwtaccess') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret_access
    })
  }

  async validate(payload: { sub: string; email: string; username: string }) {
    // Fetch complete user information from database
    const user = await this.userModel.findById(payload.sub).lean().exec()

    if (!user) {
      return null
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      image: user.image,
      role: user.role
    }
  }
}
