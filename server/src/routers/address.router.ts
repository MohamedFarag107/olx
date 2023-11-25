import { Router } from 'express';

import { authMiddleware } from '@/middlewares';
import {
  createAddress,
  deleteAddressById,
  getAddressById,
  getAllAddresses,
  updateAddressById,
} from '@/controllers';
import {
  createAddressValidation,
  mongoIdValidation,
  updateAddressValidation,
} from '@/validations';

const addressRouter = Router();

addressRouter
  .route('/')
  .all(authMiddleware)
  .get(getAllAddresses)
  .post(createAddressValidation, createAddress);

addressRouter
  .route('/:id')
  .all(authMiddleware)
  .get(mongoIdValidation, getAddressById)
  .put(updateAddressValidation, updateAddressById)
  .delete(mongoIdValidation, deleteAddressById);

export { addressRouter };
