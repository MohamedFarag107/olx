import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import {
  createSize,
  deleteSizeById,
  getAllSizes,
  getSizeById,
  updateSizeById,
} from '@/controllers';
import {
  createSizeValidation,
  updateSizeValidation,
  mongoIdValidation,
} from '@/validations';

const sizeRouter = Router();

sizeRouter
  .route('/')
  .get(getAllSizes)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .post(createSizeValidation, createSize);

sizeRouter
  .route('/:id')
  .get(mongoIdValidation, getSizeById)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .put(updateSizeValidation, updateSizeById)
  .delete(mongoIdValidation, deleteSizeById);

export { sizeRouter };
