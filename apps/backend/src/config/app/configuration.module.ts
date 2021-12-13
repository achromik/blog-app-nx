import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi = require('joi');
import configuration from './configuration';
import { AppConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().min(15).required(),
        JWT_TTL: Joi.number(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().min(15).required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number(),
        JWT_CONFIRM_TOKEN_SECRET_KEY: Joi.string().min(15).required(),
        JWT_CONFIRM_TOKEN_TTL: Joi.number(),
        API_GLOBAL_PREFIX: Joi.string().allow(''),
        APP_NAME: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
