import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import {
  createSubCategory,
  deleteSubCategoryById,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
} from '@/controllers';
import {
  createSubCategoryValidation,
  mongoIdValidation,
  updateSubCategoryValidation,
} from '@/validations';

const subCategoryRouter = Router();

subCategoryRouter
  .route('/')
  .get(getAllSubCategories)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .post(createSubCategoryValidation, createSubCategory);

subCategoryRouter
  .route('/:id')
  .get(mongoIdValidation, getSubCategoryById)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .put(updateSubCategoryValidation, updateSubCategoryById)
  .delete(mongoIdValidation, deleteSubCategoryById);

export { subCategoryRouter };
