import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import type { Session } from 'next-auth';
import { useSnackbar } from 'notistack';
import type { SetStateAction, Dispatch } from 'react';
import { type FC } from 'react';

import AvatarButton from './AvatarButton';
import type { ProfileFormikValues } from './formik';
import { getProfileFormInitialValues, profileFormSchema } from './formik';

import { updateAccount } from 'apiCallers/profile';
import type { UpdateAccountWithIdDto } from 'backend/dtos/profile.dto';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import type { InputFieldProps } from 'components/common/inputs/FormikInputGenerator/types';
import { InputType } from 'components/common/inputs/FormikInputGenerator/types';
import type { ApiReturnData, ProfileActionMode } from 'types/common';
import { reloadSession } from 'utils/account.helper';
import { getDefaultOnApiError } from 'utils/error.helper';
import { trimFormikValues } from 'utils/string.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type ProfileFormProps = {
  user: Session['user'];
  mode: ProfileActionMode;
  setMode: Dispatch<SetStateAction<ProfileActionMode>>;
};

const ProfileForm: FC<ProfileFormProps> = ({ user, mode, setMode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleFormSubmit = (values: ProfileFormikValues) => {
    const trimmedValues = trimFormikValues(values) as ProfileFormikValues;
    invokeUpdateAccount(trimmedValues);
  };

  const formik = useFormik<ProfileFormikValues>({
    initialValues: getProfileFormInitialValues(user),
    validationSchema: toFormikValidationSchema(profileFormSchema),
    onSubmit: handleFormSubmit,
  });

  const { mutate: invokeUpdateAccount, isLoading: isUpdatingAccount } =
    useMutation<
      ApiReturnData<typeof updateAccount>,
      unknown,
      UpdateAccountWithIdDto
    >({
      mutationFn: (data) => updateAccount(data),
      onSuccess: () => {
        enqueueSnackbar(`Cập nhật thông tin thành công`, {
          variant: 'success',
        });

        reloadSession();

        queryClient.refetchQueries({
          queryKey: ['accounts', user.id],
        });
        setMode('view');
      },
      onError: (error: AxiosError) => {
        getDefaultOnApiError({
          operationName: `cập nhật thông tin`,
          onDone: () => setMode('view'),
        })(error);
      },
    });

  const inputProps: InputFieldProps[] = [
    {
      commonInputProps: {
        name: 'lastName',
        label: 'Họ và tên lót',
        type: InputType.TEXT_FIELD,
        disabled: true,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'firstName',
        label: 'Tên',
        type: InputType.TEXT_FIELD,
        disabled: true,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'degree',
        label: 'Học vị',
        type: InputType.TEXT_FIELD,
        disabled: true,
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'phone',
        label: 'Số điện thoại',
        type: InputType.TEXT_FIELD,
        disabled: mode === 'view',
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
    {
      commonInputProps: {
        name: 'email',
        label: 'Email',
        type: InputType.TEXT_FIELD,
        disabled: mode === 'view',
      },
      gridProps: {
        sm: 12,
        md: 6,
      },
    },
  ];
  return (
    <FormikProvider value={formik}>
      <AvatarButton user={user} />
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
                  loading={isUpdatingAccount}
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

export default ProfileForm;
