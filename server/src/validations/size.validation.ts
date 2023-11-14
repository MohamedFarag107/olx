import { check } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import { isHexColor } from '@/utils';
import { SizeType } from '@/types/enums';
export const createSizeValidation = [
  check('name')
    .notEmpty()
    .withMessage('color name is required')
    .isIn(Object.values(SizeType))
    .withMessage(`size name is invalid, must be one of ${Object.values(SizeType).join(', ')}`),
  validationMiddleware,
];
