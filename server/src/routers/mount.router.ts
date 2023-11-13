import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';

const mountRouter = Router();

mountRouter.use('/auth', authRouter);
mountRouter.use('/users', userRouter);

export { mountRouter };
