import { Router } from 'express';

import { authMiddleware } from '@/middlewares';
import { createCategory, getAllCategories } from '@/controllers';
import { createCategoryValidation } from '@/validations';

const categoryRouter = Router();

categoryRouter
  .route('/')
  .all(authMiddleware)
  .get(getAllCategories)
  .post(createCategoryValidation, createCategory);

export { categoryRouter };
