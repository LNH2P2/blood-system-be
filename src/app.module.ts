import { AuthModule } from '@api/auth/auth.module'
import { RefreshTokenModule } from '@api/refresh-token/refresh-token.module'
import { UsersModule } from '@api/users/users.module'
import { HospitalModule } from '@api/hospital/hospital.module'
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
// import { RestJwtAuthGuard } from 'src/guards/jwt.guard'
import { APP_GUARD } from '@nestjs/core'
import { JwtAccessAuthGuard } from '@api/auth/guard/auth-access.guard'
import { LocalFilesModule } from './api/local-files/local-files.module'
import { RestJwtAuthGuard } from 'src/guards/jwt.guard'

@Module({
  imports: [
    CatModule,
    AuthModule,
    UsersModule,
    CatModule,
    DonationRequestModule,
    NotificationModule,
    BlogModule,
    RefreshTokenModule,
    HospitalModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      load: [databaseConfig, appConfig]
    }),
    MongooseModule.forRoot('mongodb://mongo:mongo@localhost:27019/blood_system_db?authSource=admin'),
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
    }),
    LocalFilesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard
    }
  ]
})
export class AppModule {}
