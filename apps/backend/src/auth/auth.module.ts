import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule } from '../config/app/configuration.module';
import { AppConfigService } from '../config/app/configuration.service';
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy';
import { TokenService } from '../token/token.service';
import { TokenSchema } from '../token/schemas/token.schema';
import { JwtConfirmTokenStrategy } from './strategies/jwtConfirmToken.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Token', schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.secretKey,
        signOptions: { expiresIn: config.jwtTTL },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtConfirmTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AppConfigModule],
})
export class AuthModule {}
