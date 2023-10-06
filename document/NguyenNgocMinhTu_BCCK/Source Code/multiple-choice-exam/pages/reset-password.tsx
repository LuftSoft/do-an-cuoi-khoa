import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import { Container } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { isPast } from 'date-fns';
import { FormikProvider, useFormik } from 'formik';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, type FC } from 'react';
import type { z } from 'zod';

import { resetPassword } from 'apiCallers/profile';
import { PasswordResetEntity } from 'backend/entities/passwordReset.entity';
import { CommonService } from 'backend/services/common.service';
import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import type { InputFieldProps } from 'components/common/inputs/FormikInputGenerator/types';
import { InputType } from 'components/common/inputs/FormikInputGenerator/types';
import PublicFormWrapper from 'components/common/PublicFormWrapper';
import { CustomizedCard } from 'components/common/StyledComponents';
import MuiImage from 'components/image/MuiImage';
import EyeToggleButton from 'components/pages/login/EyeToggleButton';
import { basePasswordFormSchema } from 'components/pages/profile/PasswordForm/formik';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';
import type { AccountModel } from 'models/account.model';
import { getDefaultOnApiError } from 'utils/error.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const Wrapper = styled(CustomizedCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const resetPasswordFormSchema = basePasswordFormSchema
  .pick({
    confirmNewPassword: true,
    newPassword: true,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau',
    path: ['confirmNewPassword'], // This makes sure the error is attached to the confirmNewPassword field
  });

type ResetPasswordFormikValues = z.infer<typeof resetPasswordFormSchema>;

type ResetPasswordPageProps = {
  isValidToken: boolean;
  token: string;
};
const ResetPasswordPage: FC<ResetPasswordPageProps> = ({
  isValidToken,
  token,
}) => {
  const { mutate: invokeResetPassword, isLoading: isResettingPassword } =
    useMutation<AccountModel, unknown, string>({
      mutationFn: (newPassword) => resetPassword(token, newPassword),
      onSuccess: () => {
        setInfoDialogVisible(true);
      },
      onError: getDefaultOnApiError({
        operationName: 'khôi phục mật khẩu',
      }),
    });

  const handleFormSubmit = (values: ResetPasswordFormikValues) => {
    console.log(values);
    invokeResetPassword(values.newPassword);
  };

  const router = useRouter();
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [buttonContent, setButtonContent] = useState('Khôi phục');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik<ResetPasswordFormikValues>({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: handleFormSubmit,
    validationSchema: toFormikValidationSchema(resetPasswordFormSchema),
  });

  const newPasswordProps = {
    htmlType: passwordVisible ? 'text' : 'password',
    InputProps: {
      endAdornment: (
        <EyeToggleButton
          show={passwordVisible}
          click={() => setPasswordVisible((visible) => !visible)}
        />
      ),
    },
  };

  const inputProps: InputFieldProps<ResetPasswordFormikValues>[] = [
    {
      commonInputProps: {
        name: 'newPassword',
        label: 'Mật khẩu mới',
        type: InputType.TEXT_FIELD,
        ...newPasswordProps,
      },
      gridProps: {
        xs: 12,
      },
    },
    {
      commonInputProps: {
        name: 'confirmNewPassword',
        label: 'Xác nhận mật khẩu mới',
        type: InputType.TEXT_FIELD,
        ...newPasswordProps,
      },
      gridProps: {
        xs: 12,
      },
    },
  ];

  return (
    <>
      <FlexRowCenter
        height='100vh'
        flexDirection='column'
        sx={{
          backgroundImage: 'url("assets/backgrounds/gradient-bg.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <SEO title='Khôi phục mật khẩu' />

        {isValidToken ? (
          <PublicFormWrapper>
            <H1 fontSize={20} fontWeight={700} mb={3} textAlign='center'>
              Khôi phục mật khẩu
            </H1>

            <FlexBox justifyContent='space-between' flexWrap='wrap'>
              <FormikProvider value={formik}>
                <form style={{ width: '100%' }} onSubmit={formik.handleSubmit}>
                  <FormWrapper>
                    <FormikInputGenerator inputFieldProps={inputProps} />
                    <FormButtonActionWrapper>
                      <LoadingButton
                        loading={isResettingPassword || isRedirecting}
                        fullWidth
                        type='submit'
                        color='primary'
                        variant='contained'
                      >
                        {buttonContent}
                      </LoadingButton>
                    </FormButtonActionWrapper>
                  </FormWrapper>
                </form>
              </FormikProvider>
            </FlexBox>
          </PublicFormWrapper>
        ) : (
          <Container>
            <Wrapper>
              <FlexBox
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <MuiImage
                  src='/assets/images/illustrations/404.svg'
                  sx={{ display: 'block', maxWidth: 320, width: '100%', mb: 3 }}
                />
                <H1 lineHeight={1.1} mt='1.5rem'>
                  Xác thực thất bại
                </H1>

                <Paragraph color='grey.800' mt='0.3rem'>
                  Đường dẫn đã hết hạn hoặc không tồn tại
                </Paragraph>
              </FlexBox>
            </Wrapper>
          </Container>
        )}
      </FlexRowCenter>
      <DefaultDialog
        open={infoDialogVisible}
        handleClose={() => setInfoDialogVisible(false)}
        content='Khôi phục mật khẩu thành công, bạn sẽ được chuyển đến trang đăng nhập sau khi tắt thông báo này'
        title='Thông báo'
        action={{
          handleConfirm: () => {
            setButtonContent('Đang chuyển hướng...');
            setIsRedirecting(true);
            router.push('/');
          },
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ResetPasswordPageProps
> = async (context) => {
  const { token } = context.query;
  const passwordReset = await CommonService.getRecord({
    entity: PasswordResetEntity,
    filter: {
      token: token as string,
    },
  });

  return {
    props: {
      isValidToken:
        !!passwordReset &&
        !passwordReset.used &&
        !isPast(passwordReset.expirationDate),
      token: passwordReset?.token || '',
    },
  };
};

export default ResetPasswordPage;
