import { Role } from '@prisma/client';
import { Router } from 'express';

import { allowedTo, authMiddleware } from '@/middlewares';
import {
  createBrand,
  deleteBrandById,
  getAllBrands,
  getBrandById,
  updateBrandById,
} from '@/controllers';
import {
  createBrandValidation,
  mongoIdValidation,
  updateBrandValidation,
} from '@/validations';

const BrandRouter = Router();

BrandRouter.route('/')
  .get(getAllBrands)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .post(createBrandValidation, createBrand);

BrandRouter.route('/:id')
  .get(mongoIdValidation, getBrandById)
  .all(authMiddleware, allowedTo(Role.ADMIN))
  .put(updateBrandValidation, updateBrandById)
  .delete(mongoIdValidation, deleteBrandById);

export { BrandRouter };
