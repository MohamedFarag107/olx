import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import { createSize, deleteSize, getAllSizes } from '@/controllers';
import { createSizeValidation } from '@/validations';

const sizeRouter = Router();

sizeRouter
  .route('/')
  .get(getAllSizes)
  .all(authMiddleware, allowedTo(Role.ADMIN), createSizeValidation)
  .post(createSize);

sizeRouter
  .route('/:id')
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .delete(deleteSize);

export { sizeRouter };
