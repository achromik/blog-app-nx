import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidateObjectID } from '../shared/pipes/validate-object-id.pipe';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { Post as BlogPost } from './interfaces/post.interface';

interface BlogPostResponse {
  message: string;
  post: BlogPost;
}

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('post/:postID')
  async getPost(
    @Param('postID', new ValidateObjectID()) postID: string
  ): Promise<BlogPost> {
    const post = await this.blogService.getPost(postID);

    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    return post;
  }

  @Get('posts')
  async getPosts(): Promise<BlogPost[]> {
    return await this.blogService.getPosts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post')
  async addPost(
    @Body() createPostDTO: CreatePostDTO
  ): Promise<BlogPostResponse> {
    const newPost = await this.blogService.addPost(createPostDTO);

    return {
      message: 'Post has been added successfully!',
      post: newPost,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('edit')
  async editPost(
    @Query('postID', new ValidateObjectID()) postID: string,
    @Body() createPostDTO: CreatePostDTO
  ): Promise<BlogPostResponse> {
    const editedPost = await this.blogService.editPost(postID, createPostDTO);

    if (!this.editPost) {
      throw new NotFoundException('Post does not exist!');
    }

    return {
      message: 'Post has been updated successfully!',
      post: editedPost,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async deletePost(
    @Query('postID', new ValidateObjectID()) postID: string
  ): Promise<BlogPostResponse> {
    const deletedPost = await this.blogService.deletePost(postID);

    if (!deletedPost) {
      throw new NotFoundException('Post dose not exist!');
    }

    return {
      message: 'Post has been deleted successfully!',
      post: deletedPost,
    };
  }
}
