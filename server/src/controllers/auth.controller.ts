import { BadRequestError } from '@/error';
import {
  ApiResponse,
  Password,
  cryptoHash,
  exclude,
  generateToken,
  prisma,
  sendForgetPasswordEmail,
} from '@/utils';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

/**
 * @desc    signup a new user & set token in cookie
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
interface SignupBody {
  email: string;
  password: string;
}
export const signup = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = <SignupBody>req.body;

  const isUserExists = await prisma.user.findUnique({ where: { email } });

  if (isUserExists) {
    throw new BadRequestError([{ message: 'Email already exists' }]);
  }

  const hashedPassword = Password.hash(password);

  // TODO: Update user if token exists in the sessions

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: user.id });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed up successfully',
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/**
 * @desc    Auth user & set token in cookie
 * @route   POST /api/v1/auth/signin
 * @access  Public
 */
interface SigninBody {
  email: string;
  password: string;
}
export const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = <SigninBody>req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  const message = 'Email or password is incorrect';

  if (!user) {
    throw new BadRequestError([{ message }]);
  }

  const isPasswordMatch = Password.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new BadRequestError([{ message }]);
  }

  const token = generateToken({ id: user.id });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed in successfully',
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/**
 * @desc    Signout user & clear cookie
 * @route   POST /api/v1/auth/signout
 * @access  Private
 */
export const signout = expressAsyncHandler(async (req, res, next) => {
  req.session = null;

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed out successfully',
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/**
 * @desc    Forget password
 * @route   POST /api/v1/auth/forget-password
 * @access  Public
 */

interface ForgetPasswordBody {
  email: string;
}
export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = <ForgetPasswordBody>req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new BadRequestError([{ message: 'Email not found' }]);
  }

  await sendForgetPasswordEmail(email);

  const response = new ApiResponse({
    messages: [
      {
        message: 'Reset password code sent successfully',
      },
      {
        message: 'Please check your email',
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/**
 * @desc    Reset password
 * @route   PATCH /api/v1/auth/reset-password
 * @access  Public
 */

interface ResetPasswordBody {
  password: string;
  code: string;
}

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { password, code } = <ResetPasswordBody>req.body;

  const hashedCode = cryptoHash(code);
  const currentTime = new Date().getTime();

  const forgetPassword = await prisma.forgetPassword.findUnique({
    where: {
      code: hashedCode,
      expiredAt: { gt: currentTime },
    },
  });

  if (!forgetPassword) {
    throw new BadRequestError([{ message: 'Invalid code or expired' }]);
  }

  const hashedPassword = Password.hash(password);

  await prisma.user.update({
    where: {
      email: forgetPassword.email,
    },
    data: {
      password: hashedPassword,
      passwordChangeAt: new Date(),
    },
  });

  await prisma.forgetPassword.deleteMany({
    where: {
      email: forgetPassword.email,
    },
  });

  const token = generateToken({ id: forgetPassword.email });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Password reset successfully',
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});
