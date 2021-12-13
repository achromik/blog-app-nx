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
      const tokenDoc = await this.tokenModel.findOne({
        userId: token.userId,
      });

      if (!tokenDoc) {
        const createdToken = new this.tokenModel(token);

        await createdToken.save();

        return createdToken;
      }

      // Due to impossibility to reassign the read-only property,
      // below is the hook to miss that issue
      (tokenDoc.jti as TokenDocument['jti']) = token.jti;
      (tokenDoc.iat as TokenDocument['iat']) = token.iat;
      (tokenDoc.device as TokenDocument['device']) = token.device;

      await tokenDoc.save();
      return tokenDoc;
    } catch (err) {
      console.log(err);
    }
  }

  async removeByUserId(userId: string): Promise<TokenDocument> {
    const deletedToken = await this.tokenModel.findOneAndDelete({ userId });

    return deletedToken;
  }

  async findByUserId(userId: string): Promise<TokenDocument> {
    const token = await this.tokenModel.findOne({ userId });

    return token;
  }
}
