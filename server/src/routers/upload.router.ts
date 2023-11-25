import { Router } from 'express';

import { uploadDisk, uploadFiles } from '@/controllers';
import { authMiddleware } from '@/middlewares';

const uploadRouter = Router();

uploadRouter
  .route('/')
  .all(authMiddleware)
  .post(uploadDisk.array('files'), uploadFiles);
export { uploadRouter };
