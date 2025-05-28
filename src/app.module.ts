import { Module } from '@nestjs/common'
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      load: [databaseConfig, appConfig]
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService
    }),
    CatModule,
    DonationRequestModule,
    NotificationModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
