import Joi from 'joi';
import { type UserCreateAndUpdateDto } from './users.entity';

export const userCreateAndUpdateSchemaDto = Joi.object<UserCreateAndUpdateDto>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  imageUrl: Joi.string(),
});
