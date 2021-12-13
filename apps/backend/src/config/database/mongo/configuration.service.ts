import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
  constructor(private configService: ConfigService) {}

  get port(): string {
    return this.configService.get<string>('mongo.port');
  }

  get host(): string {
    return this.configService.get<string>('mongo.host');
  }

  get user(): string {
    return this.configService.get<string>('mongo.user');
  }

  get pass(): string {
    return this.configService.get<string>('mongo.pass');
  }

  get dbName(): string {
    return this.configService.get<string>('mongo.dbName');
  }
}
