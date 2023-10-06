import { Chip } from '@mui/material';
import type { FC } from 'react';

type MockTestTagProps = {};

const MockTestTag: FC<MockTestTagProps> = () => {
  return (
    <Chip
      sx={{
        fontSize: 12,
        fontWeight: 500,
      }}
      label='Thi thử'
      color='warning'
    />
  );
};

export default MockTestTag;
