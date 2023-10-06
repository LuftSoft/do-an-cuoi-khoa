import { Card } from '@mui/material';
import type { FC } from 'react';

import { Paragraph } from 'components/abstract/Typography';
import MuiNextImage from 'components/image/MuiNextImage';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';

type NoResultProps = {
  title: string;
};
const NoResult: FC<NoResultProps> = ({ title }) => {
  return (
    <Card
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
      }}
    >
      <FlexRowCenter
        flexDirection='column'
        sx={{
          height: '100%',
        }}
      >
        <MuiNextImage
          src='/assets/images/illustrations/search-empty.jpg'
          sizes='20vw'
          width={120}
          height={120}
          draggable={false}
          alt='search empty illustration'
          quality={100}
        />

        <Paragraph
          fontSize={18}
          fontWeight={500}
          color={(theme) => theme.palette.grey[500]}
        >
          {title}
        </Paragraph>
      </FlexRowCenter>
    </Card>
  );
};

export default NoResult;
