import { NotFoundError } from '@/error';
import { MessageType } from '@/types/enums';
import { PaginationQuery } from '@/types/interfaces';
import {
  ApiResponse,
  ORDERED_BY_CREATED_AT,
  SEARCH_FIELDS,
  getPagination,
  prisma,
} from '@/utils';
import { Prisma, Size } from '@prisma/client';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

/** ---------------------------------------------------------------------------------- */
const SEARCHABLE_FIELDS: Array<Partial<keyof Size>> = ['name'];
/** ---------------------------------------------------------------------------------- */

/**
 * @desc    create new size
 * @route   POST /api/v1/sizes
 * @access  Private (admin)
 */
interface CreateSizeBody {
  name: Size['name'];
}
export const createSize = expressAsyncHandler(async (req, res, next) => {
  const { name } = <CreateSizeBody>req.body;

  const size = await prisma.size.create({
    data: {
      name,
    },
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Size created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: size,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    delete size
 * @route   DELETE /api/v1/sizes
 * @access  Private (admin)
 */
interface DeleteSizeParams {
  id: Size['id'];
}
export const deleteSizeById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteSizeParams>(<unknown>req.params);

  const size = await prisma.size.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });

  if (!size) {
    throw new NotFoundError([
      { message: 'Size not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Size deleted successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: size,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get all sizes
 * @route   GET /api/v1/sizes
 * @access  Public
 */

export const getAllSizes = expressAsyncHandler(async (req, res, next) => {
  let { page, limit, q, sort } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const where: Prisma.SizeWhereInput = {
    active: true,
    OR: SEARCH_FIELDS(SEARCHABLE_FIELDS, q),
  };

  const sizes = await prisma.size.findMany({
    skip,
    take: limit,
    where,
    orderBy,
  });

  const length = sizes.length;
  const total = await prisma.color.count();

  const pagination = getPagination({
    length,
    page,
    limit,
    total,
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Sizes fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: sizes,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    get size by id
 * @route   GET /api/v1/sizes/:id
 * @access  Public
 */

interface GetSizeByIdParams {
  id: Size['id'];
}

export const getSizeById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <GetSizeByIdParams>(<unknown>req.params);

  const size = await prisma.size.findUnique({ where: { id } });

  if (!size) {
    throw new NotFoundError([
      { message: 'Size not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Size fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: size,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    update size
 * @route   PUT /api/v1/sizes/:id
 * @access  Private (admin)
 */

interface UpdateSizeParams {
  id: Size['id'];
}

interface UpdateSizeBody {
  name: Size['name'];
}

export const updateSizeById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <UpdateSizeParams>(<unknown>req.params);
  const { name } = <UpdateSizeBody>req.body;

  const size = await prisma.size.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  if (!size) {
    throw new NotFoundError([
      { message: 'Size not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Size updated successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: size,
  });

  res.status(response.statusCode).json(response);
});
