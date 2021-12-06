import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  readonly email: string;

  @MinLength(4)
  readonly password: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;
}
