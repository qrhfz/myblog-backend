import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.tagsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(slug, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.tagsService.remove(slug);
  }
}
