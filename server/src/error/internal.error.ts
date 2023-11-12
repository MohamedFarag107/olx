import { StatusCodes } from "http-status-codes";
import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {
  constructor(error: Error) {
    super({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      messages: ["Something went wrong"],
      metadata: error,
    });
  }
}
