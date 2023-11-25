import { MessageType } from '@/types/enums';
import { ApiResponse, exclude, prisma } from '@/utils';
import expressAsyncHandler from 'express-async-handler';

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
export const updateMe = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.user!;

  await prisma.user.update({
    where: { id },
    data: req.body,
  });

  const response = new ApiResponse({
    messages: [
      { message: 'Profile updated successfully', type: MessageType.SUCCESS },
    ],
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/**
 * @desc    Get user details
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMe = expressAsyncHandler(async (req, res, next) => {
  const user = exclude(req.user!, ['password']);
  const response = new ApiResponse({
    messages: [
      {
        message: 'User details fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    data: user,
  });

  res.status(response.statusCode).json(response);
});
