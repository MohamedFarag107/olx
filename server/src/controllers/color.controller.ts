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
export const deleteColor = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteColorParams>(<unknown>req.params);

  const color = await prisma.color.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Color deleted successfully',
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
  let { page, limit } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const sort = <string | undefined>req.query?.sort;
  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const q = <string | undefined>req.query?.q;
  const where: Prisma.ColorWhereInput = {
    active: true,
    OR: SEARCH_FIELDS(SEARCHABLE_FIELDS, q),
  };

  console.log({
    where: JSON.stringify(where),
  });

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
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: colors,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
