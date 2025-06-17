import { IS_PUBLIC } from '@constants/app.constant'
import { Injectable, ExecutionContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class RestJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // Skip authentication for public endpoints
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])
    if (isPublic) {
      return true
    }
    // For HTTP requests, use the default behavior
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}
