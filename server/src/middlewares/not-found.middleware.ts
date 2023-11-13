import expressAsyncHandler from 'express-async-handler';
import { NotFoundError } from '../error/not-found.error';

export const globalNotFoundMiddleware = expressAsyncHandler(
  async (req, res, next) => {
    const message = `Route not found for ${req.method} ${req.path}`;
    throw new NotFoundError([{ message }]);
  },
);
