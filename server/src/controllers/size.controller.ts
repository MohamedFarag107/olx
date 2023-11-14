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
export const deleteSize = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteSizeParams>(<unknown>req.params);

  const size = await prisma.size.update({
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
        message: 'Size deleted successfully',
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
  let { page, limit } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const sort = <string | undefined>req.query?.sort;
  const orderBy = ORDERED_BY_CREATED_AT(sort);
  const q = <string | undefined>req.query?.q;

  const where: Prisma.SizeWhereInput = {
    active: true,
    OR: SEARCH_FIELDS(SEARCHABLE_FIELDS, q),
  };

  console.log({
    where: JSON.stringify(where),
  });

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
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: sizes,
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
