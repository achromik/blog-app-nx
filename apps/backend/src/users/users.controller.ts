import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { RegistrationResponse, ApiResponseStatus } from '@libs/types';

import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ConfirmTokenAuthGuard } from './guards/confirmTokenAuth.guard';
import { RequestWithUserEmail } from '../auth/interfaces/requestWithUserEmail.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async createUser(
    @Body(new ValidationPipe({ transform: true })) createUserDTO: CreateUserDTO
  ): Promise<RegistrationResponse> {
    return await this.usersService.register(createUserDTO);
  }

  @UseGuards(ConfirmTokenAuthGuard)
  @Get('confirm')
  async confirm(
    @Request() req: RequestWithUserEmail,
    @Query('token') confirmToken: string
  ) {
    const { email } = req.user;

    return await this.usersService.confirmEmail(email, confirmToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: { user: UserFromJWT }
  ): Promise<RegistrationResponse> {
    const user = await this.usersService.getByEmail(req.user.email);
    return {
      status: ApiResponseStatus.SUCCESS,
      data: { user },
    };
  }
}
