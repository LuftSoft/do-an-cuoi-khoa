import { Grid } from '@mui/material';
import type { FC, ReactNode } from 'react';
type FormButtonActionWrapperProps = {
  children: ReactNode;
};

const FormButtonActionWrapper: FC<FormButtonActionWrapperProps> = ({
  children,
}) => {
  return (
    <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
      {children}
    </Grid>
  );
};

export default FormButtonActionWrapper;
