import UserType from "./user-type";

type ArticleType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  body: string;
  thumb: string | null;
  category: string;
  is_featured: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  authorId: string;
  author?: UserType;
};

export default ArticleType;
