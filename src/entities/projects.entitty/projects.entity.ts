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
  geografia: string;
  anatomia: string;
  matematicas: string;
  arte: string;
  literatura: string;
  fisica: string;
  biologia: string;
  historia: string;
  quimica: string;
  musica: string;
  economia: string;
  filosofia: string;
  derecho: string;
  idiomas: string;
  informatica: string;
  geologia: string;
  psicologia: string;
  contabilidad: string;
  astronomia: string;
  hosteleria: string;
  sociologia: string;
  sexologia: string;
  ingenieria: string;
  arquitectura: string;
  paleontologia: string;
};
