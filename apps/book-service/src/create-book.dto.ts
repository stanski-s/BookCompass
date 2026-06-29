export class CreateBookDto {
  title!: string;
  author!: string;
  price!: number;
  categories!: string[];
  description!: string;
  coverUrl?: string;
}
