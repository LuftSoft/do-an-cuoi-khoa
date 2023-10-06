import { Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { PaginatedResponse } from 'types/pagination';

interface UsePaginationQueryParams<TOtherArgs> {
  baseQueryKey: any[];
  fetchPaginationDataFn: (currPageNum: number, otherArgs: any) => Promise<any>;
  enabled?: boolean;
  otherArgs?: TOtherArgs;
}
const usePaginationQuery = <TReturnData, TOtherArgs = any>({
  baseQueryKey,
  fetchPaginationDataFn,
  enabled,
  otherArgs,
}: UsePaginationQueryParams<TOtherArgs>) => {
  const router = useRouter();
  const initialPageStr = router.query.p as string;
  const initialPageNum = parseInt(initialPageStr);

  const [currPageNum, setCurrPageNum] = useState(initialPageNum || 1);

  const { data: paginatedRes, isLoading } = useQuery<
    PaginatedResponse<TReturnData>
  >({
    queryKey: [...baseQueryKey, currPageNum],
    queryFn: () => fetchPaginationDataFn(currPageNum, otherArgs),
    keepPreviousData: true,
    enabled,
  });

  const paginationComponent = (
    <Pagination
      count={paginatedRes?.metadata.totalPages || 1}
      color='primary'
      variant='outlined'
      onChange={(_, value) => setCurrPageNum(value)}
      defaultPage={currPageNum}
    />
  );

  return {
    isLoading,
    paginatedRes,
    paginationComponent,
  };
};
export default usePaginationQuery;
