import { IsEmail, IsOptional, Matches } from 'class-validator';
import { getEmailRegexPattern } from '@libs/utils';
import { Match } from '../../shared/decorators/match.decorator';
import { UserExists } from '../../shared/decorators/userExists.decorator';

export class CreateUserDTO {
  @UserExists()
  @IsEmail()
  readonly email: string;

  @Matches(getEmailRegexPattern(), {
    message:
      'Password should be at least 8 characters long including 1 uppercase letter, 1 special character, alphanumeric characters',
  })
  readonly password: string;

  @Match<CreateUserDTO>('password')
  readonly confirmPassword: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;
}
