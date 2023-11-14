// sort, filter, q (search), fields, populate, pagination (page, limit)
// const excludedFields = [
//   'sort',
//   'limit',
//   'page',
//   'fields',
//   'q',
//   'populate',
// ];
  //   query: { page: '2', limit: '2', populate: 'mo', sort: [ 'name', '-age' ] }

export interface IQuery {
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string;
  populate?: string;
  q?: { [key: string]: string };
  [key: string]: string | string[] | { [key: string]: string } | undefined;
}

import { ApiPagination } from './api-response';

export class ApiFeature<T> {
  public filter: any;
  constructor(private query: IQuery) {}
}
