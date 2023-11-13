import { check } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const signinValidation = [
  check('email').isEmail().withMessage('Email is invalid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];

export const signupValidation = [
  check('email').isEmail().withMessage('Email is invalid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];

export const forgetPasswordValidation = [
  check('email').isEmail().withMessage('Email is invalid'),
  validationMiddleware,
];

export const resetPasswordValidation = [
  check('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 characters'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];
