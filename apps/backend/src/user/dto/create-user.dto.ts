export class CreateUserDTO {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}
