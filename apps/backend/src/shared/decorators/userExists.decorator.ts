import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../users/users.service';

export function UserExists(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: string) {
    const user = await this.usersService.getByEmail(value);

    return !user;
  }

  defaultMessage(_: ValidationArguments) {
    return `User with that email already exist`;
  }
}
