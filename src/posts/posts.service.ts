import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { title, body, tags } = createPostDto;
    const convertedTags = tags
      ? await Promise.all(
          tags.map(async (tag) => {
            const aTag = await this.tagService.findOne(tag);
            return aTag;
          }),
        )
      : undefined;

    const post = this.postRepository.create({
      title,
      body,
    });
    post.tags = convertedTags;
    console.log(post);
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    try {
      return this.postRepository.find({ relations: ['tags'] });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail(id, {
        relations: ['tags'],
      });
      console.log(post.tags);
      return post;
    } catch (_) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.findOne(id);
      return this.postRepository.save(post);
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
