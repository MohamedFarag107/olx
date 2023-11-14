import { Prisma } from '@prisma/client';

export const ORDERED_BY_CREATED_AT = (sort: string | undefined) => ({
  createdAt:
    sort && Number(sort) < 0 ? Prisma.SortOrder.desc : Prisma.SortOrder.asc,
});

export const SEARCH_FIELDS = <T>(
  fields: Array<Partial<keyof T>>,
  q: string | undefined,
) =>
  fields.map((key) => ({
    [key]: {
      contains: q || '',
      mode: 'insensitive',
    },
  }));
