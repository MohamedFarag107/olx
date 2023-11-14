import { check } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import { isHexColor } from '@/utils';
export const createColorValidation = [
  check('code')
    .notEmpty()
    .withMessage('color code is required')
    .custom((value) => {
      const isColorCode = isHexColor(value);
      if (!isColorCode) {
        throw new Error('color code is invalid');
      }

      return true;
    }),
  check('name').notEmpty().withMessage('color name is required'),
  validationMiddleware,
];
