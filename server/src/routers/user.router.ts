import { Router } from 'express';

import { getMe, updateMe } from '@/controllers';
import { authMiddleware } from '@/middlewares';
import { updateMeValidation } from '@/validations';

const userRouter = Router();

userRouter
  .route('/me')
  .all(authMiddleware)
  .put(updateMeValidation, updateMe)
  .get(getMe);

export { userRouter };
