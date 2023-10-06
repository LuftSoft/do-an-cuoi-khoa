import { Button } from '@mui/material';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import SEO from 'components/abstract/SEO';
import MuiImage from 'components/image/MuiImage';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';

const Error404: NextPage = () => {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <FlexRowCenter px={2} minHeight='100vh' flexDirection='column'>
      <SEO title='Không tìm thấy trang' />
      <MuiImage
        src='/assets/images/illustrations/404.svg'
        sx={{ display: 'block', maxWidth: 320, width: '100%', mb: 3 }}
      />

      <FlexBox flexWrap='wrap'>
        <Button
          variant='outlined'
          color='primary'
          sx={{ m: 1 }}
          onClick={handleGoBack}
        >
          Quay lại
        </Button>

        <Link href='/' passHref legacyBehavior>
          <Button variant='contained' color='primary' sx={{ m: 1 }}>
            Về trang chủ
          </Button>
        </Link>
      </FlexBox>
    </FlexRowCenter>
  );
};

export default Error404;
