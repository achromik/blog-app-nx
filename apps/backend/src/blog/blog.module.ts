import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogSchema } from './schemas/blog.schema';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Post', schema: BlogSchema }]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      {
        method: RequestMethod.POST,
        path: 'blog/post',
      },
      {
        method: RequestMethod.PUT,
        path: '/blog/edit',
      },
      {
        method: RequestMethod.DELETE,
        path: '/blog/delete',
      }
    );
  }
}
