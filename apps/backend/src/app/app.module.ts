import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URL') ||
          `mongodb://${config.get<string>(
            'MONGODB_USERNAME'
          )}:${config.get<string>('MONGODB_PASSWORD')}@${config.get<string>(
            'MONGODB_HOST',
            'localhost'
          )}:${config.get<number>('MONGODB_PORT', 27017)}/`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    BlogModule,
    AuthzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
