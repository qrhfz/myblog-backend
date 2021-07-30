import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.pagesService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(slug, updatePageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.pagesService.remove(slug);
  }
}
