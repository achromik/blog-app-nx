import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import { UsersModule } from '../users/users.module';
import { MongoConfigService } from '../config/database/mongo/configuration.service';
import { MongoConfigModule } from '../config/database/mongo/configuration.module';
import { AuthModule } from '../auth/auth.module';

const imports = [
  ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
  }),
  MongooseModule.forRootAsync({
    imports: [MongoConfigModule],
    useFactory: async (config: MongoConfigService) => ({
      uri: config.databaseURL,
      dbName: config.dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    inject: [MongoConfigService],
  }),
  BlogModule,
  UsersModule,
  AuthModule,
];

if (process.env.NODE_ENV === 'production') {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    })
  );
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
