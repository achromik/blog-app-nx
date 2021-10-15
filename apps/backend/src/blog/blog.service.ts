import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Post } from './interfaces/post.interface';
import { CreatePostDTO } from './dto/create-post.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async addPost(createPostDTO: CreatePostDTO): Promise<Post> {
    const newPost = new this.postModel(createPostDTO);

    return await newPost.save();
  }

  async getPost(postID: string): Promise<Post> {
    return await this.postModel.findById(postID).exec();
  }

  async getPosts(): Promise<Post[]> {
    return await this.postModel.find().exec();
  }

  async editPost(postID: string, createPostDTO: CreatePostDTO): Promise<Post> {
    return await this.postModel.findByIdAndUpdate(postID, createPostDTO, {
      new: true,
    });
  }

  async deletePost(postID: string): Promise<Post> {
    return this.postModel.findByIdAndRemove(postID);
  }
}
