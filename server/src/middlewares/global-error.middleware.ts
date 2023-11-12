import { Request, Response, NextFunction } from "express";
import { ApiError } from "../error/api.error";
import { StatusCodes } from "http-status-codes";
import { InternalServerError } from "../error/internal.error";
export const globalErrorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ("statusCode" in err) {
    return res.status(err.statusCode).json(err);
  }

  const apiError = new InternalServerError(err);

  res.status(apiError.statusCode).json(apiError);
};
