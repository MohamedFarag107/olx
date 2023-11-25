import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import {
  createColor,
  deleteColorById,
  getAllColors,
  getColorById,
  updateColorById,
} from '@/controllers';
import {
  createColorValidation,
  mongoIdValidation,
  updateColorValidation,
} from '@/validations';

const colorRouter = Router();

colorRouter
  .route('/')
  .get(getAllColors)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .post(createColorValidation, createColor);

colorRouter
  .route('/:id')
  .get(mongoIdValidation, getColorById)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .put(updateColorValidation, updateColorById)
  .delete(mongoIdValidation, deleteColorById);

export { colorRouter };
