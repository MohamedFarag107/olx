import expressAsyncHandler from 'express-async-handler';
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import { Category, Prisma } from '@prisma/client';

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
  const slug = slugify(name, { lower: true, trim: true });

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
/**
 * @desc    update category
 * @route   PUT /api/v1/categories/:id
 * @access  Private Admin
 */

interface UpdateCategoryParams {
  id: Category['id'];
}

interface UpdateCategoryBody extends Partial<CreateCategoryBody> {}

export const updateCategoryById = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = <UpdateCategoryParams>(<unknown>req.params);
    const { image, name } = <UpdateCategoryBody>req.body;
    const slug = name ? slugify(name, { lower: true, trim: true }) : undefined;

    const category = await recoverFromNotFound(
      prisma.category.update({
        where: { id, active: true },
        data: {
          name,
          slug,
          image,
        },
      }),
    );

    if (!category) {
      throw new NotFoundError([
        { message: 'Category not found', type: MessageType.ERROR },
      ]);
    }

    const response = new ApiResponse({
      data: category,
      messages: [
        {
          message: 'Category updated successfully',
          type: MessageType.SUCCESS,
        },
      ],
      statusCode: StatusCodes.CREATED,
    });

    res.status(response.statusCode).json(response);
  },
);
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private Admin
 */
interface DeleteCategoryParams {
  id: Category['id'];
}

export const deleteCategoryById = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = <DeleteCategoryParams>(<unknown>req.params);

    const category = await recoverFromNotFound(
      prisma.category.update({
        where: { id, active: true },
        data: { active: false },
      }),
    );

    if (!category) {
      throw new NotFoundError([
        { message: 'Category not found', type: MessageType.ERROR },
      ]);
    }

    const response = new ApiResponse({
      data: category,
      messages: [
        {
          message: 'Category deleted successfully',
          type: MessageType.SUCCESS,
        },
      ],
    });

    res.status(response.statusCode).json(response);
  },
);
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
interface GetCategoryByIdParams {
  id: Category['id'];
}

export const getCategoryById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <GetCategoryByIdParams>(<unknown>req.params);

  const category = await prisma.category.findUnique({
    where: { id, active: true },
  });

  if (!category) {
    throw new NotFoundError([
      { message: 'Category not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: category,
    messages: [
      {
        message: 'Category fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
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
/** ---------------------------------------------------------------------------------- */
