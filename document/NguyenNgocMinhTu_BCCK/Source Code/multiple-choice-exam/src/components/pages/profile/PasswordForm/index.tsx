import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import type { SetStateAction, Dispatch } from 'react';
import { useState, type FC } from 'react';

import type { PasswordFormikValues } from './formik';
import { getPasswordFormInitialValues, passwordFormSchema } from './formik';

import type { updateAccount } from 'apiCallers/profile';
import { changePassword } from 'apiCallers/profile';
import type { ChangePasswordWithIdDto } from 'backend/dtos/profile.dto';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import type { InputFieldProps } from 'components/common/inputs/FormikInputGenerator/types';
import { InputType } from 'components/common/inputs/FormikInputGenerator/types';
import EyeToggleButton from 'components/pages/login/EyeToggleButton';
import type { ApiReturnData, ProfileActionMode } from 'types/common';
import { reloadSession } from 'utils/account.helper';
import { getDefaultOnApiError } from 'utils/error.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type PasswordFormProps = {
  userId: string;
  mode: ProfileActionMode;
  setMode: Dispatch<SetStateAction<ProfileActionMode>>;
};

const PasswordForm: FC<PasswordFormProps> = ({ userId, mode, setMode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const handleFormSubmit = (values: PasswordFormikValues) => {
    console.log('file: index.tsx:36 - handleFormSubmit - values:', values);
    const accountInputs: ChangePasswordWithIdDto = {
      id: userId,
      ...values,
    };
    invokeChangePassword(accountInputs);
  };

  const formik = useFormik<PasswordFormikValues>({
    initialValues: getPasswordFormInitialValues(),
    validationSchema: toFormikValidationSchema(passwordFormSchema),
    onSubmit: handleFormSubmit,
  });

  const { mutate: invokeChangePassword, isLoading: isChangingPassword } =
    useMutation<
      ApiReturnData<typeof updateAccount>,
      unknown,
      ChangePasswordWithIdDto
    >({
      mutationFn: (data) => changePassword(data),
      onSuccess: () => {
        enqueueSnackbar('Đổi mật khẩu thành công', {
          variant: 'success',
        });
        formik.resetForm();
        setOldPasswordVisible(false);
        setNewPasswordVisible(false);

        reloadSession();

        queryClient.refetchQueries({
          queryKey: ['accounts'],
        });
        setMode('view');
      },
      onError: (error: AxiosError) => {
        getDefaultOnApiError({
          operationName: `đổi mật khẩu`,
        })(error);
      },
    });

  const oldPasswordProps = {
    htmlType: oldPasswordVisible ? 'text' : 'password',
    InputProps: {
      endAdornment: (
        <EyeToggleButton
          show={oldPasswordVisible}
          click={() => setOldPasswordVisible((visible) => !visible)}
        />
      ),
    },
  };

  const newPasswordProps = {
    htmlType: newPasswordVisible ? 'text' : 'password',
    InputProps: {
      endAdornment: (
        <EyeToggleButton
          show={newPasswordVisible}
          click={() => setNewPasswordVisible((visible) => !visible)}
        />
      ),
    },
  };

  const inputProps: InputFieldProps<PasswordFormikValues>[] = [
    {
      commonInputProps: {
        name: 'oldPassword',
        label: 'Mật khẩu cũ',
        type: InputType.TEXT_FIELD,
        disabled: mode === 'view',
        ...oldPasswordProps,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'newPassword',
        label: 'Mật khẩu mới',
        type: InputType.TEXT_FIELD,
        disabled: mode === 'view',
        ...newPasswordProps,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'confirmNewPassword',
        label: 'Xác nhận mật khẩu mới',
        type: InputType.TEXT_FIELD,
        disabled: mode === 'view',
        ...newPasswordProps,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
  ];
  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <FormWrapper>
          <FormikInputGenerator inputFieldProps={inputProps} />

          <FormButtonActionWrapper>
            {mode === 'edit' ? (
              <>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    setMode('view');
                    formik.resetForm();
                  }}
                >
                  Huỷ
                </Button>
                <LoadingButton
                  loading={isChangingPassword}
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  Lưu thay đổi
                </LoadingButton>
              </>
            ) : (
              <Button
                startIcon={<EditRoundedIcon />}
                variant='contained'
                color='primary'
                onClick={() => {
                  setMode('edit');
                }}
              >
                Chỉnh sửa
              </Button>
            )}
          </FormButtonActionWrapper>
        </FormWrapper>
      </form>
    </FormikProvider>
  );
};

export default PasswordForm;
