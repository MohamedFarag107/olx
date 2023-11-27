export interface ApiPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
  length: number;
}

export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  FAIL = "fail",
}
export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface ApiResponse<T> {
  name: string;
  statusCode: number;
  status: ResponseStatus;
  messages: { message: string; type: MessageType }[];
  pagination?: ApiPagination;
  data: T;
  metadata?: any;
}

export interface ApiError {
  name: string;
  statusCode: number;
  status: ResponseStatus;
  messages: { message: string; type: MessageType }[];
  metadata?: any;
  stack?: string;
}

type StatusType = boolean;

export interface ServiceResponse<T> {
  status: StatusType;
  data: StatusType extends true ? ApiResponse<T> : ApiError;
}
