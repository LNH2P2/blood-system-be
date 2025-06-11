import { AuthModule } from '@api/auth/auth.module'
import { RefreshToken } from '@api/refresh-token/entities/refresh-token.entity'
import { UsersModule } from '@api/users/users.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '@database/config/database.config'
import { CatModule } from '@api/cat/cat.module'
import appConfig from '@config/app.config'
import { MongooseConfigService } from '@database/mongoose-config.service'
import { NotificationModule } from './api/notification/notification.module'
import { BlogModule } from './api/blog/blog.module'
import { DonationRequestModule } from '@api/donation-request/donation-request.module'
import { RestJwtAuthGuard } from 'src/guards/jwt.guard'

@Module({
  imports: [
    CatModule,
    AuthModule,
    UsersModule,
    RefreshToken,
    CatModule,
    DonationRequestModule,
    NotificationModule,
    BlogModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      load: [databaseConfig, appConfig]
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: parseInt(configService.get<string>('EMAIL_PORT') || '587', 10),
          secure: configService.get<string>('EMAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD')
          }
        },

        template: {
          dir: join(__dirname, 'email/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        },
        preview: configService.get<string>('PREVIEW_EMAIL') === 'true' ? true : false
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RestJwtAuthGuard
    }
  ]
})
export class AppModule {}
