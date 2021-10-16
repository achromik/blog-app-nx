import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogSchema } from './schemas/blog.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Post', schema: BlogSchema }]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
