import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserResponse, Status } from '@libs/types';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async createUser(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<RegisterUserResponse> {
    try {
      const newUser = await this.userService.create(createUserDTO);

      return {
        status: Status.SUCCESS,
        data: { user: newUser },
      };
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new BadRequestException('User with that email already exists!');
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: { user: UserFromJWT }
  ): Promise<RegisterUserResponse> {
    const user = await this.userService.getByEmail(req.user.email);
    return {
      status: Status.SUCCESS,
      data: { user },
    };
  }
}
