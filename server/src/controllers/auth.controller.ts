import { BadRequestError } from '@/error';
import { ApiResponse, Password, generateToken, prisma } from '@/utils';
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
 * @desc    Get user details
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id,
    },
    select: {
      password: false,
    },
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'User details fetched successfully',
      },
    ],
    statusCode: StatusCodes.OK,
    data: user,
  });

  res.status(response.statusCode).json(response);
});
