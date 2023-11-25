import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const createCategoryValidation = [
  body('name').notEmpty().withMessage('category name is required'),
  body('image').isObject().withMessage('category image is required'),
  validationMiddleware,
];

export const updateCategoryValidation = [
  param('id').isMongoId().withMessage('category id is required'),
  body('name').notEmpty().withMessage('category name is required').optional(),
  body('image').isObject().withMessage('category image is required').optional(),
  validationMiddleware,
];
