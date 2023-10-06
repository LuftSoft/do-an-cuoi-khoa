import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebounce } from 'react-use';

type FetchFunction<T> = (keyword: string, otherArgs?: any) => Promise<T>;

type UseTableSearchParams<T> = {
  baseQueryKey: string[];
  fetchFunction: FetchFunction<T>;
  paginatedRecords?: T;
  isLoading: boolean;
  otherArgs?: any;
};
const useTableSearch = <T>({
  baseQueryKey,
  fetchFunction,
  paginatedRecords,
  isLoading,
  otherArgs,
}: UseTableSearchParams<T>) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');

  const [isWaiting, setIsWaiting] = useState(false);

  useDebounce(
    () => {
      setDebouncedSearchKeyword(searchKeyword);
      setIsWaiting(false);
    },
    300,
    [searchKeyword],
  );

  const { data: filteredRecords, isLoading: isSearching } = useQuery<T>({
    queryKey: [...baseQueryKey, debouncedSearchKeyword],
    queryFn: () => fetchFunction(debouncedSearchKeyword, otherArgs),
    enabled: !!debouncedSearchKeyword,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    if (keyword) {
      setIsWaiting(true);
    } else {
      setIsWaiting(false);
    }
  };

  const isProcessing =
    (!searchKeyword && isLoading) ||
    (searchKeyword && isSearching) ||
    isWaiting;

  const recordsToShow = searchKeyword ? filteredRecords : paginatedRecords;

  const skeletonVisible = isProcessing;
  const recordsVisible = !isProcessing;
  const noResultVisible =
    !isProcessing && (recordsToShow as Array<T>)?.length === 0;
  const paginationComponentVisible = !searchKeyword && !isProcessing;

  return {
    handleSearch,
    skeletonVisible,
    recordsVisible,
    noResultVisible,
    recordsToShow,
    paginationComponentVisible,
  };
};

export default useTableSearch;
