import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_MESSAGE_KEY } from '@decorators/response-message.decorator'

export interface Response<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse()
        const request = context.switchToHttp().getRequest()
        const statusCode = response.statusCode

        // Lấy custom message từ decorator hoặc tự động generate dựa trên HTTP method
        const customMessage = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler())
        const defaultMessage = this.getDefaultMessage(request.method, statusCode)

        return {
          statusCode,
          message: customMessage || defaultMessage,
          data
        }
      })
    )
  }

  private getDefaultMessage(method: string, statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) {
      switch (method.toUpperCase()) {
        case 'GET':
          return 'Data retrieved successfully'
        case 'POST':
          return 'Resource created successfully'
        case 'PUT':
        case 'PATCH':
          return 'Resource updated successfully'
        case 'DELETE':
          return 'Resource deleted successfully'
        default:
          return 'Operation completed successfully'
      }
    }
    return 'Success'
  }
}
