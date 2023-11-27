import expressAsyncHandler from 'express-async-handler';
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import { Brand, Prisma } from '@prisma/client';

import {
  ApiResponse,
  ORDERED_BY_CREATED_AT,
  getPagination,
  prisma,
  recoverFromNotFound,
} from '@/utils';
import { PaginationQuery } from '@/types/interfaces';
import { MessageType } from '@/types/enums';
import { NotFoundError } from '@/error';

/** ---------------------------------------------------------------------------------- */
const getInclude = (populate: string | undefined) => {
  const include: Prisma.BrandInclude = {
    ...(populate?.includes('products') ? { products: true } : undefined),
  };
  return include;
};
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    create new brand
 * @route   POST /api/v1/brands
 * @access  Private Admin
 */

interface CreateBrandBody {
  name: Brand['name'];
  image: Prisma.InputJsonValue;
}
export const createBrand = expressAsyncHandler(async (req, res, next) => {
  const { image, name } = <CreateBrandBody>req.body;
  const slug = slugify(name, { lower: true, trim: true });

  const brand = await prisma.brand.create({
    data: {
      name,
      slug,
      image,
    },
  });

  const response = new ApiResponse({
    data: brand,
    messages: [
      {
        message: 'brand created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    update brand
 * @route   PUT /api/v1/brands/:id
 * @access  Private Admin
 */

interface UpdateBrandParams {
  id: Brand['id'];
}

interface UpdateBrandBody extends Partial<CreateBrandBody> {}

export const updateBrandById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <UpdateBrandParams>(<unknown>req.params);
  const { image, name } = <UpdateBrandBody>req.body;
  const slug = name ? slugify(name, { lower: true, trim: true }) : undefined;

  const brand = await recoverFromNotFound(
    prisma.brand.update({
      where: { id, active: true },
      data: {
        name,
        slug,
        image,
      },
    }),
  );

  if (!brand) {
    throw new NotFoundError([
      { message: 'brand not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: brand,
    messages: [
      {
        message: 'brand updated successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    delete brand
 * @route   DELETE /api/v1/brands/:id
 * @access  Private Admin
 */
interface DeleteBrandParams {
  id: Brand['id'];
}

export const deleteBrandById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteBrandParams>(<unknown>req.params);

  const brand = await recoverFromNotFound(
    prisma.brand.update({
      where: { id, active: true },
      data: { active: false },
    }),
  );

  if (!brand) {
    throw new NotFoundError([
      { message: 'brand not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: brand,
    messages: [
      {
        message: 'brand deleted successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
interface GetBrandByIdParams {
  id: Brand['id'];
}

export const getBrandById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <GetBrandByIdParams>(<unknown>req.params);
  const { populate } = <PaginationQuery>(<unknown>req.query);
  const include = getInclude(populate);

  const brand = await prisma.brand.findUnique({
    where: { id, active: true },
    include,
  });

  if (!brand) {
    throw new NotFoundError([
      { message: 'brand not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: brand,
    messages: [
      {
        message: 'brand fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get all sub categories
 * @route   GET /api/v1/brands
 * @access  Public
 */
export const getAllBrands = expressAsyncHandler(async (req, res, next) => {
  let { page, limit, sort, populate } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;
  const include = getInclude(populate);

  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const where: Prisma.BrandWhereInput = {
    active: true,
  };

  const brands = await prisma.brand.findMany({
    skip,
    take: limit,
    where,
    orderBy,
    include,
  });

  const length = brands.length;
  const total = await prisma.brand.count();

  const pagination = getPagination({
    length,
    page,
    limit,
    total,
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'sub categories fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: brands,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
