import { Router } from 'express';

import { getMe, updateMe } from '@/controllers';
import { authMiddleware } from '@/middlewares';

const userRouter = Router();

userRouter.route('/me').all(authMiddleware).put(updateMe).get(getMe);

export { userRouter };
