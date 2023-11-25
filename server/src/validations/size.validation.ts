import { body } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import { SizeType } from '@/types/enums';
export const createSizeValidation = [
  body('name')
    .notEmpty()
    .withMessage('size name is required')
    .isIn(Object.values(SizeType))
    .withMessage(
      `size name is invalid, must be one of ${Object.values(SizeType).join(
        ', ',
      )}`,
    ),
  validationMiddleware,
];

export const updateSizeValidation = [
  body('id').isMongoId().withMessage('size id is required'),
  body('name')
    .notEmpty()
    .withMessage('size name is required')
    .isIn(Object.values(SizeType))
    .withMessage(
      `size name is invalid, must be one of ${Object.values(SizeType).join(
        ', ',
      )}`,
    )
    .optional(),
  validationMiddleware,
];
