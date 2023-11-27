import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from '@/controllers';
import {
  createCategoryValidation,
  mongoIdValidation,
  updateCategoryValidation,
} from '@/validations';

const categoryRouter = Router();

categoryRouter
  .route('/')
  .get(getAllCategories)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .post(createCategoryValidation, createCategory);

categoryRouter
  .route('/:id')
  .get(mongoIdValidation, getCategoryById)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .put(updateCategoryValidation, updateCategoryById)
  .delete(mongoIdValidation, deleteCategoryById);

export { categoryRouter };
