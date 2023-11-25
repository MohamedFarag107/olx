import expressAsyncHandler from 'express-async-handler';
import { Address, Category, Prisma } from '@prisma/client';
import {
  ApiResponse,
  ORDERED_BY_CREATED_AT,
  SEARCH_FIELDS,
  getPagination,
  prisma,
} from '@/utils';
import { StatusCodes } from 'http-status-codes';
import { File, PaginationQuery } from '@/types/interfaces';
import { MessageType } from '@/types/enums';
import { NotFoundError } from '@/error';
import slugify from 'slugify';

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    create new category
 * @route   POST /api/v1/categories
 * @access  Private Admin
 */

interface CreateCategoryBody {
  name: Category['name'];
  image: Prisma.InputJsonValue;
}
export const createCategory = expressAsyncHandler(async (req, res, next) => {
  const { image, name } = <CreateCategoryBody>req.body;

  const slug = slugify(name);

  const isCategoryExists = await prisma.category.findUnique({
    where: { slug },
  });

  if (isCategoryExists) {
    throw new NotFoundError([
      { message: 'Category already exists', type: MessageType.ERROR },
    ]);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      image,
    },
  });

  const response = new ApiResponse({
    data: category,
    messages: [
      {
        message: 'Category created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */

export const getAllCategories = expressAsyncHandler(async (req, res, next) => {
  let { page, limit, sort } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const where: Prisma.CategoryWhereInput = {
    active: true,
  };

  const categories = await prisma.category.findMany({
    skip,
    take: limit,
    where,
    orderBy,
  });

  const length = categories.length;
  const total = await prisma.category.count();

  const pagination = getPagination({
    length,
    page,
    limit,
    total,
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Categories fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    pagination,
    data: categories,
  });

  res.status(response.statusCode).json(response);
});
