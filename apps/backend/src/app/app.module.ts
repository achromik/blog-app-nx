import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import { UserModule } from '../user/user.module';
import { MongoConfigService } from '../config/database/mongo/configuration.service';
import { MongoConfigModule } from '../config/database/mongo/configuration.module';
import { AppConfigModule } from '../config/app/configuration.module';
import { AuthModule } from '../auth/auth.module';

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
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
      inject: [MongoConfigService],
    }),
    BlogModule,
    UserModule,
    AppConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
