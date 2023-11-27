import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';
import slugify from 'slugify';
import { deleteFile, prisma } from '@/utils';
import { File } from '@/types/interfaces';

const throwIfBrandExist = async (name: string) => {
  const slug = slugify(name, { lower: true, trim: true });
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (brand) {
    throw new Error('Brand Already Exists');
  }
};

export const createBrandValidation = [
  body('name')
    .notEmpty()
    .withMessage('brand name is required')
    .custom(async (value) => {
      await throwIfBrandExist(value);
    }),
  body('image').isObject().withMessage('brand image is required'),
  validationMiddleware,
];

export const updateBrandValidation = [
  param('id').isMongoId().withMessage('brand id is required'),
  body('name')
    .notEmpty()
    .withMessage('brand name is required')
    .custom(async (value) => {
      await throwIfBrandExist(value);
    })
    .optional(),
  body('image')
    .isObject()
    .withMessage('brand image is required')
    .custom(async (file: File, { req }) => {
      const { filename } = file;
      const { id } = req.params as { id: string };
      const brand = await prisma.brand.findUnique({ where: { id } });
      if (brand) {
        const brandImage = brand.image as unknown as File;
        if (filename !== brandImage.filename) {
          await deleteFile(brandImage.filename);
        }
      }
    })
    .optional(),

  validationMiddleware,
];
