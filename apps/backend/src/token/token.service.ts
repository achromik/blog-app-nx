import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '@libs/types';
import { TokenDocument } from './interfaces/token.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<TokenDocument>
  ) {}

  async create(token: Token): Promise<TokenDocument> {
    try {
      const createdToken = new this.tokenModel(token);

      await createdToken.save();

      return createdToken;
    } catch (err) {
      console.log(err);
    }
  }

  async removeByJTI(jti: string) {
    const deletedToken = await this.tokenModel.findOneAndDelete({
      jti,
    });

    return deletedToken;
  }

  async findByJTI(jti: string): Promise<TokenDocument> {
    const token = await this.tokenModel.findOne({ jti });

    return token;
  }
}
