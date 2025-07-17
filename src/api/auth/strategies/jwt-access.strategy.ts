import { jwtConstants } from '@constants/app.constant'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { Model } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
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
      role: user.role,
      hospitalId: user.hospitalId ? user.hospitalId.toString() : null
    }
  }
}
