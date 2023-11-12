import { StatusCodes, getReasonPhrase } from "http-status-codes";
interface ApiErrorOptions {
  statusCode: number;
  messages: string[];
  metadata?: Object;
}

export class ApiError extends Error {
  public statusCode: StatusCodes;
  public messages: string[];
  metadata?: Object;
  constructor({ statusCode, messages, metadata }: ApiErrorOptions) {
    super();
    this.statusCode = statusCode;
    this.messages = messages;
    this.metadata = metadata;
    this.name = getReasonPhrase(statusCode);
    this.stack =
      process.env.NODE_ENV === "production"
        ? "You are in production"
        : this.stack;
  }
}
