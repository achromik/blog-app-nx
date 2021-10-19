import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from '../user/interfaces/user.interface';

import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

interface RegisterUserResponse {
  message: string;
  user: User;
}

interface LoginUserResponse {
  message: string;
  access_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(
    @Body() createUserDTO: RegisterUserDTO
  ): Promise<RegisterUserResponse> {
    try {
      const newUser = await this.authService.register(createUserDTO);

      return {
        message: 'User has been registered successfully!',
        user: newUser,
      };
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new BadRequestException('User with that email already exists!');
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginUserResponse> {
    return {
      ...(await this.authService.login(req.user)),
      message: 'User has been logged successfully!',
    };
  }
}
