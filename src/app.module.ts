import { AuthModule } from '@api/auth/auth.module'
import { CatModule } from '@api/cat/cat.module'
import { DonationRequestModule } from '@api/donation-request/donation-request.module'
import { RefreshToken } from '@api/refresh-token/entities/refresh-token.entity'
import { UsersModule } from '@api/users/users.module'
import appConfig from '@config/app.config'
import databaseConfig from '@database/config/database.config'
import { MongooseConfigService } from '@database/mongoose-config.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { join } from 'path'
import { BlogModule } from './api/blog/blog.module'
import { NotificationModule } from './api/notification/notification.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

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
  providers: [AppService]
})
export class AppModule {}
