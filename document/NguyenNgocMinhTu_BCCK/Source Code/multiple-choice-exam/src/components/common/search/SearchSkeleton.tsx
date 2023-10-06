import { Skeleton } from '@mui/material';
import type { FC } from 'react';

const SearchSkeleton: FC = () => {
  return (
    <Skeleton
      variant='rectangular'
      animation='wave'
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
      }}
    />
  );
};

export default SearchSkeleton;
