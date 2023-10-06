import type { NextPage } from 'next';

import SEO from 'components/abstract/SEO';
import Login from 'components/pages/login';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';

const LoginPage: NextPage = () => {
  return (
    <FlexRowCenter
      flexDirection='column'
      minHeight='100vh'
      sx={{
        backgroundImage: 'url("assets/backgrounds/gradient-bg.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      <SEO title='Đăng nhập' />
      <Login />
    </FlexRowCenter>
  );
};

export default LoginPage;
