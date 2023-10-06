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
  composeTestQuestions,
  deleteTest,
  fetchTests,
  fetchTestsByTitle,
} from 'apiCallers/tests';
import SEO from 'components/abstract/SEO';
import { H2, Span } from 'components/abstract/Typography';
import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import Scrollbar from 'components/common/Scrollbar';
import NoResult from 'components/common/search/NoResult';
import SearchSkeleton from 'components/common/search/SearchSkeleton';
import SearchArea from 'components/common/SearchArea';
import TableHeader from 'components/common/table/TableHeader';
import PageLayout from 'components/layout';
import { TestTableHeading } from 'components/pages/tests/TestHeading';
import TestRow from 'components/pages/tests/TestRow';
import TestRowDialog from 'components/pages/tests/TestRow/TestRowDialog';
import { useFilters } from 'hooks/useFilters';
import { useIsClient } from 'hooks/useIsClient';
import usePaginationQuery from 'hooks/usePaginationQuery';
import useTableSearch from 'hooks/useTableSearch';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type {
  ApiReturnData,
  DialogActionMode,
  NextPageWithLayout,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';

const TestsPage: NextPageWithLayout = () => {
  const isClient = useIsClient();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedTest, setSelectedTest] =
    useState<TestWithLecturerAndSubjectModel>();
  const [mode, setMode] = useState<DialogActionMode>('view');
  const [testInfoDialogVisible, setTestInfoDialogVisible] = useState(false);

  const { filterProps, additionalBaseQueryKey, additionalOtherArgs } =
    useFilters({
      objectName: 'lịch thi',
    });

  const setModeEnhanced = (mode: DialogActionMode | 'hide') => {
    if (mode === 'hide') {
      setTestInfoDialogVisible(false);
      return;
    }

    setMode(mode);
    setTestInfoDialogVisible(true);
  };

  const { isLoading, paginatedRes, paginationComponent } = usePaginationQuery<
    TestWithLecturerAndSubjectModel[]
  >({
    baseQueryKey: ['tests', ...additionalBaseQueryKey],
    fetchPaginationDataFn: fetchTests,
    otherArgs: {
      ...additionalOtherArgs,
    },
  });

  const { mutate: invokeDeletingTest, isLoading: isDeletingTest } = useMutation<
    ApiReturnData<typeof deleteTest>,
    unknown,
    string
  >({
    mutationFn: (testId) => deleteTest(testId),
    onSuccess: () => {
      enqueueSnackbar(`Xoá lịch thi thành công`, {
        variant: 'success',
      });

      queryClient.refetchQueries({
        queryKey: ['tests'],
      });

      setSelectedTest(undefined);
      setDeleteDialogVisible(false);
      // setMode('hide');
    },
    onError: getDefaultOnApiError({
      operationName: 'xoá/vô hiệu hoá lịch thi',
      onDone: () => setDeleteDialogVisible(false),
    }),
  });

  const {
    mutate: invokeComposeTestQuestions,
    isLoading: isComposingTestQuestions,
  } = useMutation<ApiReturnData<typeof composeTestQuestions>, unknown, string>({
    mutationFn: (testId) => composeTestQuestions(testId),
    onSuccess: () => {
      enqueueSnackbar(`Tạo đề thi thành công`, {
        variant: 'success',
      });

      queryClient.refetchQueries({
        queryKey: ['tests'],
      });

      setTestInfoDialogVisible(false);
    },
    onError: getDefaultOnApiError({
      operationName: 'tạo đề thi',
      onDone: () => setTestInfoDialogVisible(false),
    }),
  });

  const {
    handleSearch,
    skeletonVisible,
    noResultVisible,
    recordsVisible,
    paginationComponentVisible,
    recordsToShow: tests,
  } = useTableSearch<TestWithLecturerAndSubjectModel[]>({
    baseQueryKey: ['tests', 'searchByName', ...additionalBaseQueryKey],
    fetchFunction: fetchTestsByTitle,
    paginatedRecords: paginatedRes?.data,
    isLoading,
    otherArgs: {
      ...additionalOtherArgs,
    },
  });

  return (
    <>
      <SEO title='Lịch thi' />
      <Box py={4}>
        <H2 mb={2}>Lịch thi</H2>
        <SearchArea
          searchProps={{
            handleSearch,
            placeHolder: 'Tìm theo tiêu đề lịch thi',
          }}
          filterProps={[filterProps[0]]}
          addRecordButtonProps={{
            handleBtnClick: () => {
              setMode('add');
              setTestInfoDialogVisible(true);
            },
            text: 'Thêm lịch thi',
          }}
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader heading={TestTableHeading} />
                {isClient && (
                  <TableBody>
                    {recordsVisible &&
                      tests?.map((test) => (
                        <TestRow
                          key={test.id}
                          test={test}
                          setSelectedTest={setSelectedTest}
                          setDeleteDialogVisible={setDeleteDialogVisible}
                          setMode={setModeEnhanced}
                          setOpenDialog={setTestInfoDialogVisible}
                          invokeComposeTestQuestions={
                            invokeComposeTestQuestions
                          }
                          isComposingTestQuestions={isComposingTestQuestions}
                        />
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            {skeletonVisible && <SearchSkeleton />}
            {noResultVisible && <NoResult title='Không tìm thấy lịch thi' />}
          </Scrollbar>

          {paginationComponentVisible && (
            <Stack alignItems='center' my={4}>
              {paginationComponent}
            </Stack>
          )}
        </Card>
        {/* <FlexBox justifyContent='right' mt={2}>
          <AddRecordButton
            handleBtnClick={() => {
              setMode('add');
              setOpenDialog(true);
            }}
            text='Thêm lịch thi'
          />
        </FlexBox> */}
      </Box>
      <TestRowDialog
        handleClose={(_, reason) => {
          if (reason === 'backdropClick') return;
          setTestInfoDialogVisible(false);
        }}
        test={selectedTest}
        mode={mode}
        setMode={setModeEnhanced}
        openDialog={testInfoDialogVisible}
        invokeComposeTestQuestions={invokeComposeTestQuestions}
        isComposingTestQuestions={isComposingTestQuestions}
      />
      <ConfirmDialog
        open={deleteDialogVisible}
        handleClose={() => setDeleteDialogVisible(false)}
        title='Xác nhận'
        isLoading={isDeletingTest}
        handleConfirm={() => {
          if (selectedTest) {
            invokeDeletingTest(selectedTest.id);
            return;
          }

          enqueueSnackbar(
            'Không tìm thấy môn học để xoá, vui lòng thử lại sau',
            {
              variant: 'error',
            },
          );
        }}
        content={
          <Span>
            Bạn có chắc muốn xoá{' '}
            <Span sx={{ fontWeight: 600 }}>{selectedTest?.title}?</Span>
          </Span>
        }
      />
    </>
  );
};

TestsPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default TestsPage;
