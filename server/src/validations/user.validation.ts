import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const updateMeValidation = [
  body('name').notEmpty().withMessage('name is required').optional(),
  body('profilePicture')
    .notEmpty()
    .withMessage('profilePicture is required')
    .optional(),
  validationMiddleware,
];
