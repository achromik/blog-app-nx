import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

interface UserResponse {
  message: string;
  user: User;
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async createUser(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<UserResponse> {
    const newUser = await this.userService.create(createUserDTO);

    return {
      message: 'User has been registered successfully!',
      user: newUser as User,
    };
  }
}
