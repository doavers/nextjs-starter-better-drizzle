export type AuthorType = {
  name: string;
  image: string;
  bio?: string;
  _id?: number | string;
  _ref?: number | string;
};

export type BlogType = {
  _id: number;
  title: string;
  slug?: string;
  metadata?: string;
  body?: string;
  excerpt: string;
  date: string | Date;
  coverImage?: string;
  author?: AuthorType;
  tags?: string[];
  publishedAt?: string;
};
