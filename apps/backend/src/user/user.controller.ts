import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { RegistrationResponse, ApiResponseStatus } from '@libs/types';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: { user: UserFromJWT }
  ): Promise<RegistrationResponse> {
    const user = await this.userService.getByEmail(req.user.email);
    return {
      status: ApiResponseStatus.SUCCESS,
      data: { user },
    };
  }
}
