import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import slugify from 'slugify';
import { deleteFile, prisma } from '@/utils';
import { File } from '@/types/interfaces';

const throwIfCategoryExist = async (name: string) => {
  const slug = slugify(name, { lower: true, trim: true });
  const category = await prisma.category.findUnique({ where: { slug } });
  if (category) {
    throw new Error('Category Already Exists');
  }
};

export const createCategoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('category name is required')
    .custom(async (value) => {
      await throwIfCategoryExist(value);
    }),
  body('image').isObject().withMessage('category image is required'),
  validationMiddleware,
];

export const updateCategoryValidation = [
  param('id').isMongoId().withMessage('category id is required'),
  body('name')
    .notEmpty()
    .withMessage('category name is required')
    .custom(async (value) => {
      await throwIfCategoryExist(value);
    })
    .optional(),
  body('image')
    .isObject()
    .withMessage('category image is required')
    .custom(async (file: File, { req }) => {
      const { filename } = file;
      const { id } = req.params as { id: string };
      const category = await prisma.category.findUnique({ where: { id } });
      if (category) {
        const categoryImage = category.image as unknown as File;
        if (filename !== categoryImage.filename) {
          await deleteFile(categoryImage.filename);
        }
      }
    })
    .optional(),
  validationMiddleware,
];
