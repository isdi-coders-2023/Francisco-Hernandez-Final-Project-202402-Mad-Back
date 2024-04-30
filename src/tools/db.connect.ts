import { PrismaClient } from '@prisma/client';
import createDebug from 'debug';

const debug = createDebug('FP*:db');

export const dbConnect = async () => {
  debug('db server');
  const prisma = new PrismaClient();
  return prisma;
};
