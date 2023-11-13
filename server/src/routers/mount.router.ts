import { Router } from 'express';
import { authRouter } from './auth.router';

const mountRouter = Router();

mountRouter.use('/auth', authRouter);

export { mountRouter };
