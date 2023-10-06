import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, RadioGroup, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { addDays } from 'date-fns';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useEffect, type FC, useMemo, useState } from 'react';

import type { TestFormikValues } from './formik';
import { getTestFormInitialValues, testFormSchema } from './formik';

import { fetchSubjectDropdowns } from 'apiCallers/subjects';
import type { TestDataWithMode, updateTest } from 'apiCallers/tests';
import { createOrUpdateTest } from 'apiCallers/tests';
import type { NewTestDto } from 'backend/dtos/test.dto';
import { Paragraph } from 'components/abstract/Typography';
import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import {
  InputType,
  type InputFieldProps,
} from 'components/common/inputs/FormikInputGenerator/types';
import { getIsTestDateValidToEdit } from 'components/pages/tests/helpers';
import type { SubjectDropdownModel } from 'models/subject.model';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type {
  ApiReturnData,
  DialogActionMode,
  SetModeEnhanced,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';
import { isNaNOrEmptyString } from 'utils/number.helper';
import { trimFormikValues } from 'utils/string.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type TestFormProps = {
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  test?: TestWithLecturerAndSubjectModel;
  invokeComposeTestQuestions: (testId: string) => void;
  isComposingTestQuestions: boolean;
};

const TestForm: FC<TestFormProps> = ({
  mode,
  test,
  setMode,
  invokeComposeTestQuestions,
  isComposingTestQuestions,
}) => {
  const [invalidPortion, setInvalidPortion] = useState(false);
  const [shouldRecompose, setShouldRecompose] = useState(false);
  const [confirmRecomposingDialogVisible, setConfirmRecomposingDialogVisible] =
    useState(false);
  const [recomposingConfirmed, setRecomposingConfirmed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data } = useSession();

  const isTestDateValidToEdit = getIsTestDateValidToEdit(test?.testDate);

  const { data: subjectDropdowns } = useQuery<SubjectDropdownModel[]>({
    queryKey: ['subjects', 'dropdowns'],
    queryFn: fetchSubjectDropdowns,
  });

  const { mutate: invokeUpdateTest, isLoading: isUpdatingTest } = useMutation<
    ApiReturnData<typeof updateTest>,
    unknown,
    TestDataWithMode
  >({
    mutationFn: (dataWithMode) => createOrUpdateTest(dataWithMode),
    onSuccess: (test) => {
      const operationName = mode === 'add' ? 'Tạo' : 'Chỉnh sửa';
      enqueueSnackbar(`${operationName} lịch thi thành công`, {
        variant: 'success',
      });

      if (mode === 'add' || recomposingConfirmed) {
        setRecomposingConfirmed(false);
        invokeComposeTestQuestions(test.id);
        return;
      }
      setMode('hide');
    },
    onError: (error: AxiosError) => {
      const action = mode === 'add' ? 'tạo' : 'chỉnh sửa';
      getDefaultOnApiError({
        operationName: `${action} lịch thi`,
      })(error);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ['tests'],
      });
    },
  });

  const handleFormSubmit = (values: TestFormikValues) => {
    const easyPortion = Number(values.easyPortion);
    const normalPortion = Number(values.normalPortion);
    const hardPortion = Number(values.hardPortion);

    if (invalidPortion) {
      return;
    }

    const trimmedValues = trimFormikValues(values) as TestFormikValues;

    if (shouldRecompose && !recomposingConfirmed && mode === 'edit') {
      setConfirmRecomposingDialogVisible(true);
      return;
    }

    const testDto: NewTestDto = {
      ...trimmedValues,
      subject: values.subject.id,
      durationMinutes: Number(values.durationMinutes),
      numberOfQuestions: Number(values.numberOfQuestions),
      easyPortion,
      normalPortion,
      hardPortion,
    };

    invokeUpdateTest({ data: testDto, mode });
  };

  const formik = useFormik<TestFormikValues>({
    initialValues: getTestFormInitialValues(mode, test),
    validationSchema: toFormikValidationSchema(testFormSchema),
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (mode === 'add') {
      const userId = data?.user.lecturer.id;
      formik.setFieldValue('lecturer', userId);
    }
  }, [data, formik.setFieldValue, mode]);

  const inputFieldProps: InputFieldProps<TestFormikValues>[] = useMemo(() => {
    return [
      {
        commonInputProps: {
          name: 'title',
          label: 'Tiêu đề',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 12,
        },
      },
      {
        commonInputProps: {
          name: 'subject',
          label: 'Môn học',
          type: InputType.AUTO_COMPLETE,
          disabled: mode === 'view',
        },
        autoCompleteProps: {
          getOptionLabel: (option: SubjectDropdownModel) => option.name,
          options: subjectDropdowns,
        },
        gridProps: {
          sm: 12,
        },
      },
      {
        commonInputProps: {
          name: 'testDate',
          label: 'Ngày thi',
          type: InputType.DATE_PICKER,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 6,
        },
      },
      {
        commonInputProps: {
          name: 'testDate',
          label: 'Giờ thi',
          type: InputType.TIME_PICKER,
          disabled: mode === 'view',
        },
        datePickerProps: {
          minDate: addDays(new Date(), 1),
        },
        gridProps: {
          sm: 6,
        },
      },
      {
        commonInputProps: {
          name: 'durationMinutes',
          label: 'Thời gian (phút)',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 6,
        },
      },
      {
        commonInputProps: {
          name: 'numberOfQuestions',
          label: 'Số câu',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 6,
        },
      },
      {
        commonInputProps: {
          name: 'easyPortion',
          label: 'Tỉ lệ câu dễ',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 4,
        },
      },
      {
        commonInputProps: {
          name: 'normalPortion',
          label: 'Tỉ lệ câu trung bình',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 4,
        },
      },
      {
        commonInputProps: {
          name: 'hardPortion',
          label: 'Tỉ lệ câu khó',
          type: InputType.TEXT_FIELD,
          disabled: mode === 'view',
        },
        gridProps: {
          sm: 4,
        },
      },
    ];
  }, [mode, subjectDropdowns]);

  useEffect(() => {
    const {
      easyPortion: easyPortionString,
      normalPortion: normalPortionString,
      hardPortion: hardPortionString,
      numberOfQuestions: numberOfQuestionsString,
    } = formik.values;

    const easyPortion = Number(easyPortionString);
    const normalPortion = Number(normalPortionString);
    const hardPortion = Number(hardPortionString);

    const numberOfQuestions = Number(numberOfQuestionsString);

    if (
      isNaNOrEmptyString(easyPortionString) ||
      isNaNOrEmptyString(normalPortionString) ||
      isNaNOrEmptyString(hardPortionString)
    ) {
      return;
    }

    setInvalidPortion(easyPortion + normalPortion + hardPortion !== 100);

    if (mode === 'edit') {
      setShouldRecompose(
        easyPortion !== test?.easyPortion ||
          normalPortion !== test?.normalPortion ||
          hardPortion !== test?.hardPortion ||
          numberOfQuestions !== test.numberOfQuestions,
      );
    }
  }, [
    formik.values,
    mode,
    test?.easyPortion,
    test?.hardPortion,
    test?.normalPortion,
    test?.numberOfQuestions,
  ]);

  return (
    <>
      <RadioGroup>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FormWrapper>
              <FormikInputGenerator inputFieldProps={inputFieldProps} />
              {invalidPortion && (
                <Grid item sm={12}>
                  <Paragraph
                    textAlign='center'
                    color={({ palette }) => palette.error.main}
                  >
                    Tổng tỉ lệ câu hỏi phải bằng 100%
                  </Paragraph>
                </Grid>
              )}
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
                      loading={isUpdatingTest || isComposingTestQuestions}
                      variant='contained'
                      color='primary'
                      type='submit'
                    >
                      {mode === 'add' ? 'Thêm lịch thi' : 'Lưu thay đổi'}
                    </LoadingButton>
                  </>
                ) : (
                  <Tooltip
                    title={
                      isTestDateValidToEdit
                        ? 'Chỉnh sửa lịch thi'
                        : 'Không thể chỉnh sửa lịch thi vì đã quá hạn'
                    }
                  >
                    <span>
                      <Button
                        disabled={!isTestDateValidToEdit}
                        startIcon={<EditRoundedIcon />}
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          setMode('edit');
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </FormButtonActionWrapper>
            </FormWrapper>
          </form>
        </FormikProvider>
      </RadioGroup>
      <ConfirmDialog
        title='Xác nhận'
        content={
          <>
            <Paragraph>
              Bạn đã thay đổi tỉ lệ các câu hỏi hoặc số câu hỏi của đề thi, điều
              này sẽ làm các câu hỏi trong đề thi bị chọn ngẫu nhiên lại theo tỉ
              lệ hoặc số câu hỏi mới đã đặt.
            </Paragraph>
            <Paragraph mt={1}>Xác nhận tiếp tục?</Paragraph>
          </>
        }
        handleClose={() => setConfirmRecomposingDialogVisible(false)}
        handleConfirm={() => {
          setConfirmRecomposingDialogVisible(false);
          setRecomposingConfirmed(true);
          formik.handleSubmit();
        }}
        color='info'
        open={confirmRecomposingDialogVisible}
      />
    </>
  );
};

export default TestForm;
