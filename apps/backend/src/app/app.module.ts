import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import { UserModule } from '../user/user.module';
import { MongoConfigService } from '../config/database/mongo/configuration.service';
import { MongoConfigModule } from '../config/database/mongo/configuration.module';
import { AppConfigModule } from '../config/app/configuration.module';
import { AuthModule } from '../auth/auth.module';
import { MailerConfigService } from '../config/mailer/configuration.service';
import { MailerConfigModule } from '../config/mailer/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
    }),
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: async (config: MongoConfigService) => ({
        uri: `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/`,
        dbName: config.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
      inject: [MongoConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [MailerConfigModule],
      useFactory: async (config: MailerConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          pool: true,
          auth: {
            type: 'OAuth2',
            user: config.user,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            refreshToken: config.refreshToken,
          },
        },
        preview: true,
      }),
      inject: [MailerConfigService],
    }),
    BlogModule,
    UserModule,
    AppConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
