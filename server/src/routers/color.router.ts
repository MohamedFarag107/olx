import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import { createColor, deleteColor, getAllColors } from '@/controllers';
import { createColorValidation } from '@/validations';

const colorRouter = Router();

colorRouter
  .route('/')
  .get(getAllColors)
  .all(authMiddleware, allowedTo(Role.ADMIN), createColorValidation)
  .post(createColor);

colorRouter
  .route('/:id')
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .delete(deleteColor);

export { colorRouter };
