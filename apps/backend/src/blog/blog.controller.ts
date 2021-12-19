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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

import { ValidateObjectID } from '../shared/pipes/validate-object-id.pipe';
import { UserFromJWT } from '../users/interfaces/userFromJWT.interface';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { Post as BlogPost } from './interfaces/post.interface';

interface BlogPostResponse {
  message: string;
  post: BlogPost;
}

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('post')
  async addPost(
    @Request() req: { user: UserFromJWT },
    @Body() createPostDTO: CreatePostDTO
  ): Promise<BlogPostResponse> {
    const newPost = await this.blogService.addPost({
      ...createPostDTO,
      author: req.user.userId,
    });

    return {
      message: 'Post has been added successfully!',
      post: newPost,
    };
  }

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
