import { ApiResponseStatus, RegistrationResponse } from '@libs/types';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDTO } from './dto/create-user.dto';
import { AppConfigService } from '../config/app/configuration.service';
import { MailService } from '../mail/mail.service';
import { UserDocument } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly mailService: MailService
  ) {
    this.logger = new Logger(UsersService.name);
  }

  async register(createUserDto: CreateUserDTO): Promise<RegistrationResponse> {
    const confirmToken = this.createConfirmToken(createUserDto.email);

    const createdUser = new this.userModel({ ...createUserDto, confirmToken });

    await createdUser.save();

    await this.mailService.registrationMail(createdUser, confirmToken);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: { user: createdUser },
    };
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    return user;
  }

  private async create(
    createUser: CreateUserDTO & { confirmToken: string }
  ): Promise<UserDocument> {
    const createdUser = new this.userModel(createUser);

    try {
      await createdUser.save();

      return createdUser;
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new ConflictException('User with that email already exists!');
      }
      throw err;
    }
  }

  async confirmEmail(email: string, confirmToken: string) {
    const user = await this.getByEmail(email);
    const isValidConfirmToken = user.checkConfirmToken(confirmToken);

    if (!isValidConfirmToken) {
      this.logger.error(`Invalid confirm token for user: ${email}`);

      throw new BadRequestException('Invalid confirm token!');
    }

    await this.setStatus(email);

    this.logger.log(`Email: ${email} successfully verified!`);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: { user },
    };
  }

  private async setStatus(
    email: string,
    isActive = true,
    confirmToken?: string
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    // Due to impossibility to reassign the read-only property,
    // below is the hook to miss that issue
    (user.isActive as UserDocument['isActive']) = isActive;
    (user.confirmToken as UserDocument['confirmToken']) = confirmToken;

    user.markModified('confirmToken');
    await user.save();

    return user;
  }

  private createConfirmToken(userEmail: string): string {
    const payload = { sub: userEmail };

    return this.jwtService.sign(payload, {
      secret: this.configService.confirmTokenSecretKey,
      expiresIn: this.configService.confirmTokenTTL,
    });
  }
}
