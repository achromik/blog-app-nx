import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserResponse, Status } from '@libs/types';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  @Post('register')
  async createUser(
    @Body(new ValidationPipe()) createUserDTO: RegisterUserDTO
  ): Promise<RegisterUserResponse> {
    const newUser = await this.userService.create(createUserDTO);

    await this.mailerService.sendMail({
      to: 'achromik@maildrop.c', // list of receivers
      from: 'test@achromik.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });
    // .then((data) => {
    //   console.log(data);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    return {
      status: Status.SUCCESS,
      data: { user: newUser },
    };
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
