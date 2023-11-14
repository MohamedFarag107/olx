import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { colorRouter } from './color.router';
import { sizeRouter } from './size.router';

const mountRouter = Router();

mountRouter.use('/auth', authRouter);
mountRouter.use('/users', userRouter);
mountRouter.use('/colors', colorRouter);
mountRouter.use('/sizes', sizeRouter);

export { mountRouter };
