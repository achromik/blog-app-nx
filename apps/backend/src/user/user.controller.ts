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
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserResponse, Status } from '@libs/types';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  @Post('register')
  async createUser(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<RegisterUserResponse> {
    try {
      const newUser = await this.userService.create(createUserDTO);

      this.mailerService
        .sendMail({
          to: 'achromik@maildrop.cc', // list of receivers
          from: 'test@achromik.com', // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: 'welcome', // plaintext body
          html: '<b>welcome</b>', // HTML body content
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

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
