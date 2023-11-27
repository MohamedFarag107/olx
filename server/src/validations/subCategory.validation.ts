import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import slugify from 'slugify';
import { deleteFile, prisma } from '@/utils';
import { File } from '@/types/interfaces';

const throwIfCategoryNotExist = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new Error('Category  Not Found');
  }
};

const throwIfSubCategoryExist = async (name: string) => {
  const slug = slugify(name, { lower: true, trim: true });
  const subCategory = await prisma.subCategory.findUnique({ where: { slug } });
  if (subCategory) {
    throw new Error('Sub Category Already Exists');
  }
};

export const createSubCategoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('subcategory name is required')
    .custom(async (value) => {
      await throwIfSubCategoryExist(value);
    }),
  body('image').isObject().withMessage('subcategory image is required'),
  body('categoryId')
    .notEmpty()
    .withMessage('category id is required')
    .custom(async (value) => {
      await throwIfCategoryNotExist(value);
    }),
  validationMiddleware,
];

export const updateSubCategoryValidation = [
  param('id').isMongoId().withMessage('category id is required'),
  body('name')
    .notEmpty()
    .withMessage('subcategory name is required')
    .custom(async (value) => {
      await throwIfSubCategoryExist(value);
    })
    .optional(),
  body('image')
    .isObject()
    .withMessage('subcategory image is required')
    .custom(async (file: File, { req }) => {
      const { filename } = file;
      const { id } = req.params as { id: string };
      const subCategory = await prisma.subCategory.findUnique({
        where: { id },
      });
      if (subCategory) {
        const subCategoryImage = subCategory.image as unknown as File;
        if (filename !== subCategoryImage.filename) {
          await deleteFile(subCategoryImage.filename);
        }
      }
    })
    .optional(),
  body('categoryId')
    .notEmpty()
    .withMessage('category id is required')
    .custom(async (value) => {
      await throwIfCategoryNotExist(value);
    })
    .optional(),
  validationMiddleware,
];
