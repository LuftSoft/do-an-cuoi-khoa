import { Grid, useTheme } from '@mui/material';
import type { FC, ReactNode } from 'react';
type FormWrapperProps = {
  children: ReactNode;
};

const FormWrapper: FC<FormWrapperProps> = ({ children }) => {
  const { palette } = useTheme();
  return (
    <Grid
      container
      spacing={3}
      sx={{
        '& .quill.readonly': {
          color: palette.grey['disabled'],
        },
      }}
    >
      {children}
    </Grid>
  );
};

export default FormWrapper;
