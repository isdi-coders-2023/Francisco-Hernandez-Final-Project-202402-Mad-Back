import { type User } from '../users.entity/users.entity';

export type Project = {
  id: string;
  title: string;
  content: string;
  archive: string;
  category: Category;
  author: Partial<User>;
};

export type ProjectCreateDto = {
  title: string;
  content: string;
  archive: string;
  category: Category;
  authorId: string;
};

export type ProjectUpdateDto = {
  title?: string;
  content?: string;
  archive?: string;
  category?: Category;
  authorId?: string;
};

type Category =
  | 'geography'
  | 'anatomy'
  | 'mathematics'
  | 'art'
  | 'literature'
  | 'physics'
  | 'biology'
  | 'history'
  | 'chemistry'
  | 'music'
  | 'economics'
  | 'philosophy'
  | 'law'
  | 'languages'
  | 'computerScience'
  | 'geology'
  | 'psychology'
  | 'accounting'
  | 'astronomy'
  | 'hospitality'
  | 'sociology'
  | 'sexology'
  | 'engineering'
  | 'architecture'
  | 'paleontology';
