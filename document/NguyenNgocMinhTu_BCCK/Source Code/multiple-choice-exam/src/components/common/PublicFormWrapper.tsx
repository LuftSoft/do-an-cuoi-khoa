import { Card } from '@mui/material';
import type { FC, ReactNode } from 'react';

import MuiImage from 'components/image/MuiImage';

type PublicFormWrapperProps = {
  children: ReactNode;
};

const PublicFormWrapper: FC<PublicFormWrapperProps> = ({ children }) => {
  return (
    <div>
      <MuiImage
        src='/assets/logos/blue-fav-full.svg'
        sx={{ m: 'auto', height: 70, mb: 3 }}
      />
      <Card
        elevation={3}
        sx={{
          width: 500,
          padding: '2rem 3rem',
        }}
      >
        {children}
      </Card>
    </div>
  );
};

export default PublicFormWrapper;
