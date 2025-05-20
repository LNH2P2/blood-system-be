import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpStatus, UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { ConfigService } from '@nestjs/config'
import { GlobalExceptionFilter } from '@filters/global-exception.filter'
import helmet from 'helmet'
import * as compression from 'compression'
import { AllConfigType } from '@config/config.type'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Setup security headers
  app.use(helmet())

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.use(compression())

  const configService = app.get(ConfigService<AllConfigType>)
  app.useGlobalFilters(new GlobalExceptionFilter(configService))

  app.setGlobalPrefix(configService.get('app.apiPrefix', { infer: true }) ?? 'api')

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

  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap().catch((err) => console.error('Failed to start server:', err))
