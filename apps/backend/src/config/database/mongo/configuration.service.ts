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

  get dbSrvURL(): string {
    return this.configService.get<string>('mongo.dbSrvURL');
  }

  get databaseURL(): string {
    const srv = this.dbSrvURL.split('@').pop();

    return srv
      ? `mongodb+srv://${this.user}:${this.pass}@${srv}/${this.dbName}?retryWrites=true&w=majority`
      : `mongodb://${this.user}:${this.pass}@${this.host}:${this.port}/${this.dbName}?retryWrites=true&w=majority`;
  }
}
