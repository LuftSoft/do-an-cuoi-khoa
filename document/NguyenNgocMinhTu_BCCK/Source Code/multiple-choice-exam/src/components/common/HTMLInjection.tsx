import { Box } from '@mui/system';
import type { FC } from 'react';
type HTMLInjectionProps = {
  htmlText: string | undefined;
};

const HTMLInjection: FC<HTMLInjectionProps> = ({ htmlText }) => {
  return (
    <Box
      sx={{
        '& p': {
          my: 1,
        },
        '& ul': {
          listStyle: 'initial',
          paddingLeft: '30px',
        },
      }}
      dangerouslySetInnerHTML={{ __html: htmlText || '' }}
    />
  );
};

export default HTMLInjection;
