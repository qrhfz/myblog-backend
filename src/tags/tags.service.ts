import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { kebabCase } from 'src/utils';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const { name } = createTagDto;
      const slug = kebabCase(name);
      const tag = this.tagRepository.create({ name, slug });
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Tag[]> {
    try {
      return this.tagRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(slug: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository
        .createQueryBuilder('tag')
        .leftJoinAndSelect('tag.posts', 'post')
        .select(['tag.name', 'post.id', 'post.title', 'post.date'])
        .where('tag.slug = :slug', { slug: slug })
        .getOneOrFail();
      return tag;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOneWithoutPosts(slug: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOneOrFail(slug);
      return tag;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(slug: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.findOne(slug);
      return this.tagRepository.save({ ...tag, ...updateTagDto });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(slug: string) {
    try {
      const tag = await this.findOne(slug);
      return await this.tagRepository.remove(tag);
    } catch (error) {
      throw error;
    }
  }
}
