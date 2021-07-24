import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { PagesModule } from './pages/pages.module';
// import config from '../ormconfig';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BLOG_DB_HOST || 'localhost',
      port: parseInt(process.env.BLOG_DB_PORT) || 5432,
      username: process.env.BLOG_DB_USERNAME || 'postgres',
      password: process.env.BLOG_DB_PASSWORD || 'good boi',
      database: process.env.BLOG_DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TagsModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
