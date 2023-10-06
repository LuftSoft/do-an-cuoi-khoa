import { Search } from '@mui/icons-material';
import type { InputBaseProps } from '@mui/material';
import { InputBase, styled } from '@mui/material';
import type { FC } from 'react';

// styled component
export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  fontSize: 14,
  maxWidth: 350,
  fontWeight: 500,
  padding: '0 1rem',
  borderRadius: '8px',
  color: theme.palette.grey[700],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[500]}`,
  [theme.breakpoints.down('sm')]: { maxWidth: '100%' },
}));

const SearchInput: FC<InputBaseProps> = (props) => {
  return (
    <StyledInputBase
      startAdornment={<Search sx={{ fontSize: 19, mr: 0.5 }} />}
      {...props}
    />
  );
};

export default SearchInput;
