import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { colorRouter } from './color.router';
import { sizeRouter } from './size.router';
import { addressRouter } from './address.router';
import { uploadRouter } from './upload.router';
import { categoryRouter } from './category.router';

const mountRouter = Router();

mountRouter.use('/auth', authRouter);
mountRouter.use('/users', userRouter);
mountRouter.use('/colors', colorRouter);
mountRouter.use('/sizes', sizeRouter);
mountRouter.use('/address', addressRouter);
mountRouter.use('/uploads', uploadRouter);
mountRouter.use('/categories', categoryRouter);


export { mountRouter };
