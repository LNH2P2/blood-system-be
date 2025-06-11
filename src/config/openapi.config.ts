import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NextFunction, Request, Response } from 'express'

export function configSwagger(app: INestApplication) {
  const api_documentation_credentials = {
    name: 'admin',
    pass: 'admin'
  }

  const config = new DocumentBuilder()
    .setTitle('Claim Request project')
    .setDescription('## The Claim Request API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization'
      },
      'access-token'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const http_adapter = app.getHttpAdapter()
  http_adapter.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      res.status(401).set('WWW-Authenticate', 'Basic').send('Unauthorized')
      return
    }

    const authHeader = req.headers.authorization
    if (authHeader.startsWith('Basic ')) {
      const encodedPart = authHeader.split(' ')[1]
      const buff = Buffer.from(encodedPart, 'base64')
      const text = buff.toString('ascii')
      const [name, pass] = text.split(':')

      if (name !== api_documentation_credentials.name || pass !== api_documentation_credentials.pass) {
        res.status(401).set('WWW-Authenticate', 'Basic').send('Unauthorized')
        return
      }
    } else if (authHeader.startsWith('Bearer ')) {
      next()
      return
    } else {
      res.status(401).set('WWW-Authenticate', 'Basic').send('Unauthorized')
      return
    }
    next()
  })

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true }
  })
}
