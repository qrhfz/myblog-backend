import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryColumn()
  slug: string;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
