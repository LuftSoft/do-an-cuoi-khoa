import type { CardProps } from '@mui/material';
import { Card, styled } from '@mui/material';
import type { FC } from 'react';

type WrapperProps = { passwordVisibility?: boolean };

export const Wrapper = styled<FC<WrapperProps & CardProps>>(
  // another way to handle shouldForwardProp
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, passwordVisibility, ...rest }) => (
    <Card {...rest}>{children}</Card>
  ),
)<CardProps>(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: '2rem 3rem',
  [theme.breakpoints.down('sm')]: { width: '100%' },
  '.passwordEye': {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
}));
