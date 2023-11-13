import { Router } from 'express';

import { getMe, signin, signout, signup } from '@/controllers';
import { signinValidation, signupValidation } from '@/validations';
import { authMiddleware } from '@/middlewares';

const authRouter = Router();

authRouter.route('/signup').post(signupValidation, signup);
authRouter.route('/signin').post(signinValidation, signin);
authRouter.route('/signout').post(authMiddleware, signout);
authRouter.route('/me').get(authMiddleware, getMe);

export { authRouter };
