import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const createAddressValidation = [
  body('street').notEmpty().withMessage('Street must be a string'),
  body('city').notEmpty().withMessage('City must be a string'),
  body('state').notEmpty().withMessage('State must be a string'),
  body('country').notEmpty().withMessage('Country must be a string'),
  body('zip').notEmpty().withMessage('Zip must be a string'),
  body('isDefault')
    .isBoolean()
    .withMessage('Is default must be a boolean')
    .default(false)
    .optional(),
  validationMiddleware,
];

export const updateAddressValidation = [
  param('id').isMongoId().withMessage('address id is required'),
  body('street').notEmpty().withMessage('Street must be a string').optional(),
  body('city').notEmpty().withMessage('City must be a string').optional(),
  body('state').notEmpty().withMessage('State must be a string').optional(),
  body('country').notEmpty().withMessage('Country must be a string').optional(),
  body('zip').notEmpty().withMessage('Zip must be a string').optional(),
  body('isDefault')
    .isBoolean()
    .withMessage('Is default must be a boolean')
    .optional(),
  validationMiddleware,
];
