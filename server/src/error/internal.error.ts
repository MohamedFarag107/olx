import { StatusCodes } from 'http-status-codes';

import { ResponseStatus } from '@/types/enums';
import { ApiError } from './api.error';

export class InternalServerError extends ApiError {
  constructor(error: Error) {
    super({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      messages: [{ message: 'Something went wrong' }],
      metadata: error,
      status: ResponseStatus.ERROR,
    });
  }
}
