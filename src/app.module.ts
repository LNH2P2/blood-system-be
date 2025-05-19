import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@config/config.type';
import databaseConfig from '@database/config/database.config';
import { CatModule } from '@api/cat/cat.module';
import appConfig from '@config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      load: [databaseConfig, appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: configService.get('database.uri', {
          infer: true,
        }),
        user: configService.get('database.username', {
          infer: true,
        }),
        pass: configService.get('database.password', {
          infer: true,
        }),
        dbName: configService.get('database.name', {
          infer: true,
        }),
        authSource: 'admin',
      }),
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
