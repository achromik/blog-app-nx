import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from './app/app.module';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.npm_package_name,
              {
                prettyPrint: true,
              }
            )
          ),
        }),
      ],
    }),
  });
  const config = app.get(AppConfigService);
  const logger = app.get(Logger);

  const globalPrefix = config.globalPrefix;
  const port = config.port;

  app.setGlobalPrefix(globalPrefix);

  await app.listen(port, () => {
    logger.log(
      'Listening at http://localhost:' + port + '/' + globalPrefix,
      bootstrap.name
    );
  });
}

bootstrap();
