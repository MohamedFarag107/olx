import expressAsyncHandler from 'express-async-handler';
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import { SubCategory, Prisma } from '@prisma/client';

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
  const include: Prisma.SubCategoryInclude = {
    ...(populate?.includes('category') ? { category: true } : undefined),
    ...(populate?.includes('products') ? { products: true } : undefined),
  };
  return include;
};
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    create new sub category
 * @route   POST /api/v1/sub-categories
 * @access  Private Admin
 */

interface CreateSubCategoryBody {
  name: SubCategory['name'];
  image: Prisma.InputJsonValue;
  categoryId: SubCategory['categoryId'];
}
export const createSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { image, name, categoryId } = <CreateSubCategoryBody>req.body;
  const slug = slugify(name, { lower: true, trim: true });

  const subCategory = await prisma.subCategory.create({
    data: {
      name,
      slug,
      image,
      categoryId,
    },
  });

  const response = new ApiResponse({
    data: subCategory,
    messages: [
      {
        message: 'sub category created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    update sub category
 * @route   PUT /api/v1/sub-categories/:id
 * @access  Private Admin
 */

interface UpdateSubCategoryParams {
  id: SubCategory['id'];
}

interface UpdateSubCategoryBody extends Partial<CreateSubCategoryBody> {}

export const updateSubCategoryById = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = <UpdateSubCategoryParams>(<unknown>req.params);
    const { image, name, categoryId } = <UpdateSubCategoryBody>req.body;
    const slug = name ? slugify(name, { lower: true, trim: true }) : undefined;

    const subCategory = await recoverFromNotFound(
      prisma.subCategory.update({
        where: { id, active: true },
        data: {
          name,
          slug,
          image,
          categoryId,
        },
      }),
    );

    if (!subCategory) {
      throw new NotFoundError([
        { message: 'sub category not found', type: MessageType.ERROR },
      ]);
    }

    const response = new ApiResponse({
      data: subCategory,
      messages: [
        {
          message: 'sub category updated successfully',
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
 * @desc    delete sub category
 * @route   DELETE /api/v1/sub-categories/:id
 * @access  Private Admin
 */
interface DeleteSubCategoryParams {
  id: SubCategory['id'];
}

export const deleteSubCategoryById = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = <DeleteSubCategoryParams>(<unknown>req.params);

    const subCategory = await recoverFromNotFound(
      prisma.subCategory.update({
        where: { id, active: true },
        data: { active: false },
      }),
    );

    if (!subCategory) {
      throw new NotFoundError([
        { message: 'sub category not found', type: MessageType.ERROR },
      ]);
    }

    const response = new ApiResponse({
      data: subCategory,
      messages: [
        {
          message: 'sub category deleted successfully',
          type: MessageType.SUCCESS,
        },
      ],
    });

    res.status(response.statusCode).json(response);
  },
);
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get sub category by id
 * @route   GET /api/v1/sub-categories/:id
 * @access  Public
 */
interface GetSubCategoryByIdParams {
  id: SubCategory['id'];
}

export const getSubCategoryById = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = <GetSubCategoryByIdParams>(<unknown>req.params);
    const { populate } = <PaginationQuery>(<unknown>req.query);
    const include = getInclude(populate);

    const subCategory = await prisma.subCategory.findUnique({
      where: { id, active: true },
      include,
    });

    if (!subCategory) {
      throw new NotFoundError([
        { message: 'sub category not found', type: MessageType.ERROR },
      ]);
    }

    const response = new ApiResponse({
      data: subCategory,
      messages: [
        {
          message: 'sub category fetched successfully',
          type: MessageType.SUCCESS,
        },
      ],
    });

    res.status(response.statusCode).json(response);
  },
);
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    get all sub categories
 * @route   GET /api/v1/sub-categories
 * @access  Public
 */
export const getAllSubCategories = expressAsyncHandler(
  async (req, res, next) => {
    let { page, limit, sort, populate } = <PaginationQuery>(<unknown>req.query);

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;
    const include = getInclude(populate);

    const orderBy = ORDERED_BY_CREATED_AT(sort);

    const where: Prisma.SubCategoryWhereInput = {
      active: true,
    };

    const subCategories = await prisma.subCategory.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include,
    });

    const length = subCategories.length;
    const total = await prisma.subCategory.count();

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
      data: subCategories,
    });

    res.status(response.statusCode).json(response);
  },
);
/** ---------------------------------------------------------------------------------- */
