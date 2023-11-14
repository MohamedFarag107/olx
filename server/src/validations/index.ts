import { check } from 'express-validator';
import { validationMiddleware } from '@/middlewares';

export const mongoIdValidation = [
  check('id').isMongoId().withMessage('id is invalid'),
  validationMiddleware,
];

export * from './auth.validation';
export * from './color.validation';
export * from './size.validation';

