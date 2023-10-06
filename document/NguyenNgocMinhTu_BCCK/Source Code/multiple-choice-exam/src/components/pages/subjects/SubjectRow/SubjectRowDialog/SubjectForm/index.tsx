import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import type { FC } from 'react';

import type { SubjectFormikValues } from './formik';
import { getSubjectFormInitialValues, subjectFormSchema } from './formik';

import type { SubjectDataWithMode, updateSubject } from 'apiCallers/subjects';
import { createOrUpdateSubject } from 'apiCallers/subjects';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import {
  InputType,
  type InputFieldProps,
} from 'components/common/inputs/FormikInputGenerator/types';
import type { SubjectModel } from 'models/subject.model';
import type {
  ApiReturnData,
  DialogActionMode,
  SetModeEnhanced,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';
import { trimFormikValues } from 'utils/string.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type SubjectFormProps = {
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  subject?: SubjectModel;
};

const SubjectForm: FC<SubjectFormProps> = ({ mode, subject, setMode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: invokeUpdateSubject, isLoading: isUpdatingSubject } =
    useMutation<
      ApiReturnData<typeof updateSubject>,
      unknown,
      SubjectDataWithMode
    >({
      mutationFn: (dataWithMode) => createOrUpdateSubject(dataWithMode),
      onSuccess: () => {
        const operationName = mode === 'add' ? 'Tạo' : 'Chỉnh sửa';
        enqueueSnackbar(`${operationName} môn học thành công`, {
          variant: 'success',
        });

        queryClient.refetchQueries({
          queryKey: ['subjects'],
        });

        setMode('hide');
      },
      onError: (error: AxiosError) => {
        const action = mode === 'add' ? 'tạo' : 'chỉnh sửa';
        getDefaultOnApiError({
          operationName: `${action} môn học`,
        })(error);
      },
    });

  const handleFormSubmit = (values: SubjectFormikValues) => {
    const trimmedValues = trimFormikValues(values) as SubjectFormikValues;
    const data = {
      id: subject?.id,
      ...trimmedValues,
    };
    invokeUpdateSubject({ data, mode });
  };

  const formik = useFormik<SubjectFormikValues>({
    initialValues: getSubjectFormInitialValues(mode, subject),
    validationSchema: toFormikValidationSchema(subjectFormSchema),
    onSubmit: handleFormSubmit,
  });

  const isViewing = mode === 'view';
  const inputProps: InputFieldProps[] = [
    {
      commonInputProps: {
        name: 'name',
        label: 'Tên môn học',
        type: InputType.TEXT_FIELD,
        disabled: isViewing,
      },
      gridProps: {
        md: 12,
      },
    },
    {
      commonInputProps: {
        name: 'description',
        label: 'Mô tả',
        type: InputType.TEXT_AREA,
        disabled: isViewing,
      },
      gridProps: {
        md: 12,
      },
    },
  ];

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <FormWrapper>
          <FormikInputGenerator inputFieldProps={inputProps} />

          {/* FIXME: Refactor this section to be DRY if have time */}
          <FormButtonActionWrapper>
            {mode === 'add' || mode === 'edit' ? (
              <>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    setMode('hide');
                  }}
                >
                  Huỷ
                </Button>
                <LoadingButton
                  loading={isUpdatingSubject}
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  {mode === 'add' ? 'Thêm môn học' : 'Lưu thay đổi'}
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

export default SubjectForm;
