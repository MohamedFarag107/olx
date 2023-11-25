import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
export const createColorValidation = [
  body('code')
    .notEmpty()
    .withMessage('color code is required')
    .isHexColor()
    .withMessage('color code must be a valid hex color'),
  body('name').notEmpty().withMessage('color name is required'),
  validationMiddleware,
];

export const updateColorValidation = [
  param('id').isMongoId().withMessage('color id is required'),
  body('code')
    .notEmpty()
    .withMessage('color code is required')
    .isHexColor()
    .withMessage('color code must be a valid hex color')
    .optional(),
  body('name').notEmpty().withMessage('color name is required').optional(),
  validationMiddleware,
];
