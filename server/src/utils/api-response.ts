import { ResponseStatus } from '@/types/enums';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export interface ApiPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
  length: number;
}

interface ApiResponseOptions {
  name: string;
  statusCode: StatusCodes;
  status: ResponseStatus;
  messages: { message: string; type?: string }[];
  pagination?: ApiPagination;
  data: any;
  metadata?: any;
}

export class ApiResponse {
  public statusCode;
  name;
  status;
  messages;
  pagination?: ApiPagination;
  data;
  constructor({
    statusCode,
    messages,
    data,
    pagination,
  }: {
    statusCode: ApiResponseOptions['statusCode'];
    messages: ApiResponseOptions['messages'];
    data: ApiResponseOptions['data'];
    pagination?: ApiResponseOptions['pagination'];
  }) {
    this.name = getReasonPhrase(statusCode);
    this.statusCode = statusCode;
    this.status = ResponseStatus.SUCCESS;
    this.messages = messages;
    pagination &&
      (this.pagination = {
        pages: pagination.pages,
        page: pagination.page,
        length: pagination.length,
        limit: pagination.limit,
        total: pagination.total,
      });
    this.data = data;
  }
}
