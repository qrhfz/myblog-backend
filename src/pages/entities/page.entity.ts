import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Page {
  @PrimaryColumn()
  slug: string;

  @Column()
  title: string;

  @Column()
  body: string;
}
