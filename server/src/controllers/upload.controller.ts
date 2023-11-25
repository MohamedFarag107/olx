import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import multer from 'multer';
import { readFileSync } from 'fs';

import { FileType, MessageType } from '@/types/enums';
import { File } from '@/types/interfaces';
import { NotFoundError } from '@/error';
import { ApiResponse } from '@/utils';
import { format } from 'date-fns';

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const UPLOAD_DIR = `${process.cwd()}/src/uploads`;
/** ---------------------------------------------------------------------------------- */
/**
 * @desc    upload
 * @route   POST /api/v1/upload
 * @access  Private logged in user
 */

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(UPLOAD_DIR);

    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split('/')[1];
    const originalname = file.originalname.split('.')[0].replace(/ /g, '-');
    const uniqueId = new Date().getTime();
    const date = format(new Date(), 'yyyy-MM-dd HH-mm-ss a')
      .toString()
      .replace(/ /g, '-');
    const filename = `${originalname}-${uniqueId}-${date}.${fileExtension}`;
    cb(null, filename);
  },
});

export const uploadDisk = multer({
  storage: diskStorage,
  limits: { fileSize: FILE_SIZE },
});

const getFileType = (mimetype: string): FileType => {
  const type = mimetype.split('/')[0];

  switch (type) {
    case 'image':
      return FileType.IMAGE;
    case 'video':
      return FileType.VIDEO;
    case 'audio':
      return FileType.AUDIO;
    case 'application':
      return FileType.DOCUMENT;
    default:
      return FileType.OTHER;
  }
};

const getFileSizeInMB = (size: number): number => {
  return +(size / 1024 / 1024).toFixed(2);
};

const getFile = async (file: Express.Multer.File): Promise<File> => {
  let encodingBase64;
  const type = getFileType(file?.mimetype);
  if (type === FileType.IMAGE) {
    const fileOnDisk = readFileSync(`${UPLOAD_DIR}/${file?.filename}`);

    encodingBase64 = (
      await sharp(fileOnDisk)
        .resize({
          width: 100,
          fit: 'contain',
        })
        .toBuffer()
    ).toString('base64');
  }

  return {
    filename: file?.filename,
    originalname: file?.originalname,
    size: getFileSizeInMB(file?.size),
    encoding: encodingBase64,
    type,
  };
};

export const uploadFiles = expressAsyncHandler(async (req, res, next) => {
  if (!req.files) {
    throw new NotFoundError([
      { message: 'File not found', type: MessageType.ERROR },
    ]);
  }

  const files: File[] = await Promise.all(
    (req.files as Express.Multer.File[]).map((file) => getFile(file)),
  );

  const response = new ApiResponse({
    data: files,
    messages: [
      {
        message: 'File uploaded successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
