import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(TagsService) private tagService: TagsService,
  ) {}

  async convertTags(strTags: string[]): Promise<Tag[]> {
    return await Promise.all(
      strTags.map(async (strTag) => {
        return await this.tagService.findOneWithoutPosts(strTag);
      }),
    );
  }

  async create(createPostDto: CreatePostDto): Promise<any> {
    const { title, body, tags } = createPostDto;
    const convertedTags = tags ? await this.convertTags(tags) : undefined;
    const post = this.postRepository.create({
      title,
      body,
    });
    post.tags = convertedTags;
    return { id: (await this.postRepository.save(post)).id };
  }

  async findAll(): Promise<Post[]> {
    try {
      return this.postRepository.find({
        select: ['id', 'date', 'title'],
        relations: ['tags'],
        order: { date: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail(id, {
        relations: ['tags'],
      });
      return post;
    } catch (_) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<any> {
    try {
      const post = await this.findOne(id);
      const { tags, ...postContent } = updatePostDto;
      const updatedTags = tags
        ? await this.convertTags(updatePostDto.tags)
        : undefined;
      const updatedPost = this.postRepository.create({
        ...post,
        ...postContent,
        tags: updatedTags,
      });
      return { id: (await this.postRepository.save(updatedPost)).id };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    try {
      const post = await this.findOne(id);
      return await this.postRepository.remove(post);
    } catch (error) {
      throw error;
    }
  }
}
