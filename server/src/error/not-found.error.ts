import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ApiError } from "./api.error";

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super({
      statusCode: StatusCodes.NOT_FOUND,
      messages: [message],
      metadata: {},
    });
  }
}
