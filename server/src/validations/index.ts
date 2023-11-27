import { param } from 'express-validator';
import { validationMiddleware } from '@/middlewares';

export const mongoIdValidation = [
  param('id').isMongoId().withMessage('id is invalid'),
  validationMiddleware,
];

export * from './auth.validation';
export * from './color.validation';
export * from './size.validation';
export * from './address.validation';
export * from './user.validation';
export * from './category.validation';
export * from './subCategory.validation';
export * from './brand.validation';