import SEO from 'components/abstract/SEO';
import ForgotPasswordForm from 'components/pages/forgot-password';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';
import { type NextPageWithLayout } from 'types/common';

const ForgotPasswordPage: NextPageWithLayout = () => {
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
      <SEO title='Khôi phục mật khẩu' />
      <ForgotPasswordForm />
    </FlexRowCenter>
  );
};

export default ForgotPasswordPage;
