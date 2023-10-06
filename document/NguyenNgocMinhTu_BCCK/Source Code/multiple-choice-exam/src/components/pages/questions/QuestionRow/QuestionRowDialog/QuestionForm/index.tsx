import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, RadioGroup, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useEffect, type FC, useState, useMemo } from 'react';

import type { QuestionFormikValues } from './formik';
import { getQuestionFormInitialValues, questionFormSchema } from './formik';

import type { QuestionDataWithMode } from 'apiCallers/questions';
import { updateQuestion } from 'apiCallers/questions';
import { createOrUpdateQuestion } from 'apiCallers/questions';
import { fetchSubjectDropdowns } from 'apiCallers/subjects';
import type { NewQuestionDto } from 'backend/dtos/question.dto';
import { Option } from 'backend/enums/question.enum';
import { Paragraph } from 'components/abstract/Typography';
import DropZone from 'components/common/DropZone';
import FormButtonActionWrapper from 'components/common/inputs/form/FormButtonActionWrapper';
import FormWrapper from 'components/common/inputs/form/FormWrapper';
import FormikInputGenerator from 'components/common/inputs/FormikInputGenerator';
import {
  InputType,
  type InputFieldProps,
} from 'components/common/inputs/FormikInputGenerator/types';
import MuiImage from 'components/image/MuiImage';
import { DIFFICULTY_OPTIONS } from 'constants/question.constants';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import type { SubjectDropdownModel } from 'models/subject.model';
import type {
  ApiReturnData,
  DialogActionMode,
  SetModeEnhanced,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';
import { handleUpload } from 'utils/imagekit.helper';
import { trimFormikValues } from 'utils/string.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type QuestionFormProps = {
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  question?: FullyPopulatedQuestionModel;
};

const QuestionForm: FC<QuestionFormProps> = ({ mode, question, setMode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data } = useSession();
  const lecturerId = data?.user.lecturer.id;
  const isAuthorizedToEditQuestion = lecturerId === question?.lecturer.id;
  const [isUpdatingImageUrl, setIsUpdatingImageUrl] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File>();

  const { data: subjectDropdowns } = useQuery<SubjectDropdownModel[]>({
    queryKey: ['subjects', 'dropdowns'],
    queryFn: fetchSubjectDropdowns,
  });

  // isLoading is only used when deleting image.
  const { mutate: invokeUpdateImageUrl } = useMutation<
    ApiReturnData<typeof updateQuestion>,
    unknown,
    { id: string; imageUrl: string }
  >({
    mutationFn: (data) => updateQuestion(data),
    onSuccess: () => {
      enqueueSnackbar('Tải ảnh lên thành công', {
        variant: 'success',
      });
    },
    onError: getDefaultOnApiError({
      operationName: `tải ảnh`,
      onDone: () => {},
    }),
    onSettled: () => {
      setMode('hide');
      setIsUpdatingImageUrl(false);
      queryClient.refetchQueries({
        queryKey: ['questions'],
      });
    },
  });

  const { mutate: invokeUpdateQuestion, isLoading: isUpdatingQuestion } =
    useMutation<
      ApiReturnData<typeof updateQuestion>,
      unknown,
      QuestionDataWithMode
    >({
      mutationFn: (dataWithMode) => createOrUpdateQuestion(dataWithMode),
      onSuccess: (question) => {
        const action = mode === 'add' ? 'Tạo' : 'Chỉnh sửa';
        enqueueSnackbar(`${action} câu hỏi thành công`, {
          variant: 'success',
        });

        if (selectedImage) {
          handleUpload(
            {
              fileName: question.id,
              onUploadStart: () => setIsUpdatingImageUrl(true),
              onUploadError: () => {
                enqueueSnackbar(`asd`, {
                  variant: 'error',
                });
              },
              onUploadSuccess: (result) => {
                const imageUrl = result[0].url;
                console.log('success', imageUrl);
                invokeUpdateImageUrl({ id: question.id, imageUrl });
              },
              folderName: `/questions`,
            },
            [selectedImage],
          );
        }

        if (!selectedImage) {
          setMode('hide');
          queryClient.refetchQueries({
            queryKey: ['questions'],
          });
        }
      },
      onError: (error: AxiosError) => {
        const action = mode === 'add' ? 'tạo' : 'chỉnh sửa';
        getDefaultOnApiError({
          operationName: `${action} câu hỏi`,
        })(error);
      },
    });

  const handleFormSubmit = (values: QuestionFormikValues) => {
    if (invalidOptionContent) return;
    const trimmedValues = trimFormikValues(values) as QuestionFormikValues;

    const questionDto: NewQuestionDto = {
      ...trimmedValues,
      subject: values.subject.id,
      difficulty: values.difficulty.value,
    };

    invokeUpdateQuestion({ data: questionDto, mode });
  };

  const formik = useFormik<QuestionFormikValues>({
    initialValues: getQuestionFormInitialValues(mode, question),
    validationSchema: toFormikValidationSchema(questionFormSchema),
    onSubmit: handleFormSubmit,
  });

  const imageUrl = useMemo((): string => {
    let imageUrl = '';
    if (formik.values.imageUrl) {
      imageUrl = formik.values.imageUrl;
    }
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }
    return imageUrl;
  }, [formik.values, selectedImage]);

  useEffect(() => {
    if (mode === 'add') {
      formik.setFieldValue('lecturer', lecturerId);
    }
  }, [data, formik.setFieldValue, mode]);

  const inputFieldProps1: InputFieldProps<QuestionFormikValues>[] = [
    {
      commonInputProps: {
        name: 'content',
        label: 'Nội dung',
        type: InputType.QUILL_EDITOR,
        disabled: mode === 'view',
      },
      gridProps: {
        sm: 12,
      },
    },
  ];

  const inputFieldProps2: InputFieldProps<QuestionFormikValues>[] = [
    {
      commonInputProps: {
        name: 'optionA',
        label: 'Câu A',
        type: InputType.RADIO_TEXT_FIELD,
        disabled: mode === 'view',
      },
      radioTextFieldProps: {
        correctOptionName: 'correctOption',
        isCorrectOption: formik.values.correctOption === Option.A,
      },
      gridProps: {
        sm: 12,
      },
    },
    {
      commonInputProps: {
        name: 'optionB',
        label: 'Câu B',
        type: InputType.RADIO_TEXT_FIELD,
        disabled: mode === 'view',
      },
      radioTextFieldProps: {
        correctOptionName: 'correctOption',
        isCorrectOption: formik.values.correctOption === Option.B,
      },
      gridProps: {
        sm: 12,
      },
    },
    {
      commonInputProps: {
        name: 'optionC',
        label: 'Câu C',
        type: InputType.RADIO_TEXT_FIELD,
        disabled: mode === 'view',
      },
      radioTextFieldProps: {
        correctOptionName: 'correctOption',
        isCorrectOption: formik.values.correctOption === Option.C,
      },
      gridProps: {
        sm: 12,
      },
    },
    {
      commonInputProps: {
        name: 'optionD',
        label: 'Câu D',
        type: InputType.RADIO_TEXT_FIELD,
        disabled: mode === 'view',
      },
      radioTextFieldProps: {
        correctOptionName: 'correctOption',
        isCorrectOption: formik.values.correctOption === Option.D,
      },
      gridProps: {
        sm: 12,
      },
    },
  ];

  const inputFieldProps3: InputFieldProps<QuestionFormikValues>[] = [
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
        md: 6,
        sm: 12,
      },
    },
    {
      commonInputProps: {
        name: 'difficulty',
        label: 'Độ khó',
        type: InputType.AUTO_COMPLETE,
        disabled: mode === 'view',
      },
      autoCompleteProps: {
        getOptionLabel: (option: (typeof DIFFICULTY_OPTIONS)[number]) =>
          option.label,
        options: DIFFICULTY_OPTIONS,
      },
      gridProps: {
        md: 6,
        sm: 12,
      },
    },
  ];

  const [invalidOptionContent, setInvalidOptionContent] = useState(false);
  useEffect(() => {
    const { optionA, optionB, optionC, optionD } = formik.values;

    const options = [optionA, optionB, optionC, optionD].filter(Boolean);

    const optionsSet = new Set(options);

    setInvalidOptionContent(optionsSet.size !== options.length);
  }, [formik.values]);

  return (
    <RadioGroup>
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: '100%',
          }}
        >
          <FormWrapper>
            <FormikInputGenerator inputFieldProps={inputFieldProps1} />
            <Grid item xs={12}>
              {!imageUrl ? (
                <DropZone
                  disabled={mode === 'view'}
                  onChange={(file) => setSelectedImage(file[0])}
                />
              ) : (
                <Box>
                  <MuiImage
                    src={imageUrl}
                    sx={{
                      maxHeight: '300px',
                      maxWidth: '600px',
                    }}
                  />
                  <LoadingButton
                    disabled={mode === 'view'}
                    onClick={() => {
                      formik.setFieldValue('imageUrl', '');
                      setSelectedImage(undefined);
                    }}
                    variant='text'
                    color='error'
                    startIcon={<DeleteOutlineOutlinedIcon />}
                  >
                    Xóa ảnh
                  </LoadingButton>
                </Box>
              )}
            </Grid>
            <FormikInputGenerator inputFieldProps={inputFieldProps2} />
            {invalidOptionContent && (
              <Grid item sm={12}>
                <Paragraph
                  textAlign='center'
                  color={({ palette }) => palette.error.main}
                >
                  Các đáp án phải có nội dung khác nhau
                </Paragraph>
              </Grid>
            )}
            <FormikInputGenerator inputFieldProps={inputFieldProps3} />

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
                    loading={isUpdatingQuestion || isUpdatingImageUrl}
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    {mode === 'add' ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
                  </LoadingButton>
                </>
              ) : (
                <Tooltip
                  title={
                    isAuthorizedToEditQuestion
                      ? 'Chỉnh sửa câu hỏi'
                      : 'Không thể chỉnh sửa câu hỏi của giảng viên khác'
                  }
                >
                  <span>
                    <Button
                      disabled={!isAuthorizedToEditQuestion}
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
  );
};

export default QuestionForm;
