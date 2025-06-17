import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType
} from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { ConfigService } from '@nestjs/config'
import { GlobalExceptionFilter } from '@filters/global-exception.filter'
import helmet from 'helmet'
import * as compression from 'compression'
import { AllConfigType } from '@config/config.type'
import { configSwagger } from '@config/openapi.config'
import { TransformInterceptor } from '@interceptors/transform.interceptor'
import { JwtAccessAuthGuard } from '@api/auth/guard/auth-access.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Setup security headers
  app.use(helmet())

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.use(compression())

  const configService = app.get(ConfigService<AllConfigType>)
  const reflector = app.get(Reflector)

  app.useGlobalFilters(new GlobalExceptionFilter(configService))
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  app.setGlobalPrefix(configService.get('app.apiPrefix', { infer: true }) ?? 'api')

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(validationErrors)
      }
    })
  )

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
  })

  // Swagger
  configSwagger(app)

  await app.listen(process.env.APP_PORT ?? 3000, '0.0.0.0')
}
bootstrap().catch((err) => console.error('Failed to start server:', err))
