import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ApiError, ApiValidationError } from '@/error';

export const validationMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const messages: ApiError['messages'] = result
        .array()
        .map((error) => ({ message: error.msg, type: error.type }));
      throw new ApiValidationError(messages, result.array());
    }

    next();
  },
);
