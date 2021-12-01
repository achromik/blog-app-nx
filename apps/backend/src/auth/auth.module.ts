import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSchema } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule } from '../config/app/configuration.module';
import { AppConfigService } from '../config/app/configuration.service';
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy';
import { TokenService } from '../token/token.service';
import { TokenSchema } from '../token/schemas/token.schema';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
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
    UserService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
