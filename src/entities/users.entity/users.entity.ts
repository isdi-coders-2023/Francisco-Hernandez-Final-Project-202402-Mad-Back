import { type Project } from '@prisma/client';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  imageUrl?: string;
  projects: Array<Partial<Project>>;
};

export type UserCreateAndUpdateDto = {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
};
