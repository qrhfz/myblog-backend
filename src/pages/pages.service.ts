import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { kebabCase } from 'src/utils';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page) private pageRepository: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto) {
    try {
      const slug = kebabCase(createPageDto.title);
      const page = this.pageRepository.create({ ...createPageDto, slug });
      return this.pageRepository.save(page);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      return this.pageRepository.find();
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async findOne(slug: string) {
    try {
      return this.pageRepository.findOneOrFail(slug);
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async update(slug: string, updatePageDto: UpdatePageDto) {
    try {
      const page = await this.findOne(slug);
      return this.pageRepository.save({ ...page, ...updatePageDto });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(slug: string) {
    try {
      const page = await this.findOne(slug);
      return await this.pageRepository.remove(page);
    } catch (error) {
      throw error;
    }
  }
}
