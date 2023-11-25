import expressAsyncHandler from 'express-async-handler';
import { Color, Prisma } from '@prisma/client';
import {
  ApiResponse,
  ORDERED_BY_CREATED_AT,
  SEARCH_FIELDS,
  getPagination,
  prisma,
} from '@/utils';
import { StatusCodes } from 'http-status-codes';
import { PaginationQuery } from '@/types/interfaces';
import { MessageType } from '@/types/enums';
import { NotFoundError } from '@/error';

/** ---------------------------------------------------------------------------------- */
const SEARCHABLE_FIELDS: Array<Partial<keyof Color>> = ['name', 'code'];
/** ---------------------------------------------------------------------------------- */

/**
 * @desc    create new color
 * @route   POST /api/v1/colors
 * @access  Private (admin)
 */
interface CreateColorBody {
  code: Color['code'];
  name: Color['name'];
}
export const createColor = expressAsyncHandler(async (req, res, next) => {
  const { code, name } = <CreateColorBody>req.body;

  const color = await prisma.color.create({
    data: {
      code,
      name,
    },
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Color created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: color,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    delete color
 * @route   DELETE /api/v1/colors
 * @access  Private (admin)
 */
interface DeleteColorParams {
  id: Color['id'];
}
export const deleteColorById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteColorParams>(<unknown>req.params);

  const color = await prisma.color.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });

  if (!color) {
    throw new NotFoundError([
      { message: 'Color not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Color deleted successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: color,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get all colors
 * @route   GET /api/v1/colors
 * @access  Public
 */

export const getAllColors = expressAsyncHandler(async (req, res, next) => {
  let { page, limit, q, sort } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const where: Prisma.ColorWhereInput = {
    active: true,
    OR: SEARCH_FIELDS(SEARCHABLE_FIELDS, q),
  };

  const colors = await prisma.color.findMany({
    skip,
    take: limit,
    where,
    orderBy,
  });

  const length = colors.length;
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
        message: 'Colors fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: colors,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    get color by id
 * @route   GET /api/v1/colors/:id
 * @access  Public
 */
interface GetColorByIdParams {
  id: Color['id'];
}

export const getColorById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <GetColorByIdParams>(<unknown>req.params);

  const color = await prisma.color.findUnique({
    where: {
      id,
    },
  });

  if (!color) {
    throw new NotFoundError([
      { message: 'Color not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Color fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: color,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    update color
 * @route   PUT /api/v1/colors/:id
 * @access  Private (admin)
 */

interface UpdateColorParams {
  id: Color['id'];
}

interface UpdateColorBody {
  code: Color['code'];
  name: Color['name'];
}

export const updateColorById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <UpdateColorParams>(<unknown>req.params);
  const { code, name } = <UpdateColorBody>req.body;
  const color = await prisma.color.update({
    where: {
      id,
    },
    data: {
      code,
      name,
    },
  });

  if (!color) {
    throw new NotFoundError([
      { message: 'Color not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    messages: [
      {
        message: 'Color updated successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: color,
  });

  res.status(response.statusCode).json(response);
});
