import type { AxiosResponse } from 'axios';

import type { PaginationMetadata } from 'types/pagination';

export const getPaginationHeader = (res: AxiosResponse): PaginationMetadata => {
  const metadata: PaginationMetadata = {
    currentPage: Number(res.headers['x-current-page']),
    totalRecords: Number(res.headers['x-total-count']),
    totalPages: Number(res.headers['x-total-pages']),
    perPage: Number(res.headers['x-per-page']),
  };

  return metadata;
};
