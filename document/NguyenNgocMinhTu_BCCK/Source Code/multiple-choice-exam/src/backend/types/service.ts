import type { DeepPartial, ObjectType } from 'typeorm';

import type { PaginationParams, SearchParams } from './pagination';

export interface GetRecordInputs<E> {
  entity: ObjectType<E>;
  relations?: string[];
  filter?: DeepPartial<E> | DeepPartial<E>[];
  select?: (keyof E)[];
  order?: DeepPartial<E>;
}

export interface GetRecordsInputs<E> extends GetRecordInputs<E> {
  paginationParams: PaginationParams;
  getAll?: boolean;
}

export interface GetRecordsByKeywordInputs<E> extends GetRecordInputs<E> {
  searchParams: SearchParams;
  getAll?: boolean;
}

export type Portions = { easy: number; normal: number; hard: number };
