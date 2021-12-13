import { IsEmail } from 'class-validator';
export class LoginUserDTO {
  @IsEmail()
  readonly email: string;

  readonly password: string;
}
