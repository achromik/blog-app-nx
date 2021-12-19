import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { AppConfigService } from '../config/app/configuration.service';
import { AppConfigModule } from '../config/app/configuration.module';
import { MailModule } from '../mail/mail.module';
import { UserExistsRule } from '../shared/decorators/userExists.decorator';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.secretKey,
        signOptions: { expiresIn: config.jwtTTL },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [UsersService, UserExistsRule],
  controllers: [UsersController],
  exports: [MailModule],
})
export class UsersModule {}
