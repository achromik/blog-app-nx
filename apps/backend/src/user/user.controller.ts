import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserFromJWT } from './interfaces/userFromJWT.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: UserFromJWT }) {
    return this.userService.getByEmail(req.user.email);
  }
}
