import { type User } from '../users.entity/users.entity';

export type Project = {
  id: string;
  title: string;
  content: string;
  archieve: string;
  category: Category;
  author: User;
};

type Category = {
  geography: string;
  anatomy: string;
  mathematics: string;
  art: string;
  literature: string;
  physics: string;
  biology: string;
  history: string;
  chemistry: string;
  music: string;
  economics: string;
  philosophy: string;
  law: string;
  languages: string;
  computerScience: string;
  geology: string;
  psychology: string;
  accounting: string;
  astronomy: string;
  hospitality: string;
  sociology: string;
  sexology: string;
  engineering: string;
  architecture: string;
  paleontology: string;
};
