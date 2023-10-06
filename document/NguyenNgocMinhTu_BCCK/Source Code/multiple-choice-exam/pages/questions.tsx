import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState, type ReactElement } from 'react';

import {
  deleteQuestion,
  fetchQuestions,
  fetchQuestionsByContent,
} from 'apiCallers/questions';
import SEO from 'components/abstract/SEO';
import { H2, Span } from 'components/abstract/Typography';
import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import Scrollbar from 'components/common/Scrollbar';
import NoResult from 'components/common/search/NoResult';
import SearchSkeleton from 'components/common/search/SearchSkeleton';
import SearchArea from 'components/common/SearchArea';
import AddRecordButton from 'components/common/table/AddRecordButton';
import TableHeader from 'components/common/table/TableHeader';
import PageLayout from 'components/layout';
import { QuestionTableHeading } from 'components/pages/questions/QuestionHeading';
import QuestionRow from 'components/pages/questions/QuestionRow';
import QuestionRowDialog from 'components/pages/questions/QuestionRow/QuestionRowDialog';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import { useFilters } from 'hooks/useFilters';
import { useIsClient } from 'hooks/useIsClient';
import usePaginationQuery from 'hooks/usePaginationQuery';
import useTableSearch from 'hooks/useTableSearch';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import type {
  ApiReturnData,
  DialogActionMode,
  NextPageWithLayout,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';

const QuestionsPage: NextPageWithLayout = () => {
  const isClient = useIsClient();

  const { enqueueSnackbar } = useSnackbar();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<FullyPopulatedQuestionModel>();

  const { filterProps, additionalBaseQueryKey, additionalOtherArgs } =
    useFilters({
      objectName: 'câu hỏi',
    });

  const [mode, setMode] = useState<DialogActionMode>('view');
  const [questionInfoDialog, setQuestionInfoDialog] = useState(false);

  const setModeEnhanced = (mode: DialogActionMode | 'hide') => {
    if (mode === 'hide') {
      setQuestionInfoDialog(false);
      return;
    }

    setMode(mode);
    setQuestionInfoDialog(true);
  };

  const { isLoading, paginatedRes, paginationComponent } = usePaginationQuery<
    FullyPopulatedQuestionModel[]
  >({
    baseQueryKey: ['questions', ...additionalBaseQueryKey],
    fetchPaginationDataFn: fetchQuestions,
    otherArgs: { ...additionalOtherArgs },
  });

  const queryClient = useQueryClient();

  const { mutate: invokeDeletingQuestion, isLoading: isDeletingQuestion } =
    useMutation<ApiReturnData<typeof deleteQuestion>, unknown, string>({
      mutationFn: (questionId) => deleteQuestion(questionId),
      onSuccess: () => {
        enqueueSnackbar(`Xoá câu hỏi thành công`, {
          variant: 'success',
        });

        queryClient.refetchQueries({
          queryKey: ['questions'],
        });

        setSelectedQuestion(undefined);
        setDeleteDialogVisible(false);
      },
      onError: getDefaultOnApiError({
        operationName: 'xoá/vô hiệu hoá câu hỏi',
        onDone: () => setDeleteDialogVisible(false),
      }),
    });

  const {
    handleSearch,
    skeletonVisible,
    noResultVisible,
    recordsVisible,
    paginationComponentVisible,
    recordsToShow: questions,
  } = useTableSearch<FullyPopulatedQuestionModel[]>({
    baseQueryKey: ['questions', 'searchByName', ...additionalBaseQueryKey],
    fetchFunction: fetchQuestionsByContent,
    paginatedRecords: paginatedRes?.data,
    isLoading,
    otherArgs: { ...additionalOtherArgs },
  });

  return (
    <>
      <SEO title='Câu hỏi' />
      <Box py={4}>
        <H2 mb={2}>Câu hỏi</H2>
        <SearchArea
          searchProps={{
            handleSearch,
            placeHolder: 'Tìm theo nội dung câu hỏi',
          }}
          // addRecordButtonProps={{
          //   handleBtnClick: () => {
          //     setMode('add');
          //     setOpenDialog(true);
          //   },
          //   text: 'Thêm câu hỏi',
          // }}
          filterProps={filterProps}
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader heading={QuestionTableHeading} />
                {isClient && (
                  <TableBody>
                    {recordsVisible &&
                      questions?.map((question) => (
                        <QuestionRow
                          key={question.id}
                          question={question}
                          setSelectedQuestion={setSelectedQuestion}
                          setDeleteDialogVisible={setDeleteDialogVisible}
                          setMode={setModeEnhanced}
                          setOpenDialog={setQuestionInfoDialog}
                        />
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            {skeletonVisible && <SearchSkeleton />}
            {noResultVisible && <NoResult title='Không tìm thấy câu hỏi' />}
          </Scrollbar>

          {paginationComponentVisible && (
            <Stack alignItems='center' my={4}>
              {paginationComponent}
            </Stack>
          )}
        </Card>
        <FlexBox justifyContent='right' mt={2}>
          <AddRecordButton
            handleBtnClick={() => {
              setMode('add');
              setQuestionInfoDialog(true);
            }}
            text='Thêm câu hỏi'
          />
        </FlexBox>
      </Box>
      <QuestionRowDialog
        handleClose={(_, reason) => {
          if (reason === 'backdropClick') return;
          setQuestionInfoDialog(false);
        }}
        question={selectedQuestion}
        mode={mode}
        setMode={setModeEnhanced}
        openDialog={questionInfoDialog}
      />
      <ConfirmDialog
        open={deleteDialogVisible}
        handleClose={() => setDeleteDialogVisible(false)}
        isLoading={isDeletingQuestion}
        handleConfirm={() => {
          if (selectedQuestion) {
            invokeDeletingQuestion(selectedQuestion.id);
            return;
          }

          enqueueSnackbar(
            'Không tìm thấy câu hỏi để xoá, vui lòng thử lại sau',
            {
              variant: 'error',
            },
          );
        }}
        title='Xác nhận xoá câu hỏi'
        content={
          <Span>{`Bạn có chắc muốn ${
            selectedQuestion?.canDelete ? 'xoá' : 'vô hiệu hoá'
          } câu hỏi đã chọn?`}</Span>
        }
      />
    </>
  );
};

QuestionsPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default QuestionsPage;
