import { LoadingButton } from '@mui/lab';
import { useMutation } from '@tanstack/react-query';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState, type FC } from 'react';

import type { ForgotPasswordFormikValues } from './formik';
import { forgotPasswordSchema } from './formik';

import { sendResetPasswordRequest } from 'apiCallers/profile';
import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import type { InputFieldProps } from 'components/common/inputs/FormikInputGenerator/types';
import { InputType } from 'components/common/inputs/FormikInputGenerator/types';
import PublicFormWrapper from 'components/common/PublicFormWrapper';
import { getDefaultOnApiError } from 'utils/error.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const ForgotPasswordForm: FC = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const handleFormSubmit = (values: ForgotPasswordFormikValues) => {
    console.log(values);
    invokeSendPasswordResetRequest(values.email);
  };

  const { mutate: invokeSendPasswordResetRequest, isLoading: isSending } =
    useMutation<string, unknown, string>({
      mutationFn: (email) => sendResetPasswordRequest(email),
      onSuccess: () => {
        setInfoDialogVisible(true);
      },
      onError: getDefaultOnApiError({
        operationName: 'gửi yêu cầu khôi phục mật khẩu',
      }),
    });

  const formik = useFormik<ForgotPasswordFormikValues>({
    initialValues: {
      email: '',
    },
    onSubmit: handleFormSubmit,
    validationSchema: toFormikValidationSchema(forgotPasswordSchema),
  });

  const inputProps: InputFieldProps[] = [
    {
      commonInputProps: {
        label: 'Nhập email của tài khoản',
        name: 'email',
        type: InputType.TEXT_FIELD,
      },
      gridProps: {
        xs: 12,
      },
    },
  ];

  return (
    <>
      <PublicFormWrapper>
        <FormikProvider value={formik}>
          <form style={{ width: '100%' }} onSubmit={formik.handleSubmit}>
            <FormWrapper>
              <FormikInputGenerator inputFieldProps={inputProps} />

              <FormButtonActionWrapper>
                <LoadingButton
                  loading={isSending || isRedirecting}
                  fullWidth
                  type='submit'
                  color='primary'
                  variant='contained'
                >
                  Gửi mã xác nhận
                </LoadingButton>
              </FormButtonActionWrapper>
            </FormWrapper>
          </form>
        </FormikProvider>
      </PublicFormWrapper>
      <DefaultDialog
        title='Thông báo'
        open={infoDialogVisible}
        handleClose={() => setInfoDialogVisible(false)}
        action={{
          handleConfirm: () => {
            setIsRedirecting(true);
            router.push('/login');
          },
        }}
        content='Mã xác nhận đã được gửi nếu có tài khoản tương ứng, vui lòng kiểm tra email, bạn sẽ được chuyển về đăng nhập sau khi tắt thông báo này'
      />
    </>
  );
};

export default ForgotPasswordForm;
