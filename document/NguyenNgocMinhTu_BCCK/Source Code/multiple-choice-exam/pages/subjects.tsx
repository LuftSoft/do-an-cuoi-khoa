import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';
import { enqueueSnackbar } from 'notistack';
import { useState, type ReactElement } from 'react';

import {
  deleteSubject,
  fetchSubjects,
  fetchSubjectsByName,
} from 'apiCallers/subjects';
import SEO from 'components/abstract/SEO';
import { H2, Span } from 'components/abstract/Typography';
import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import Scrollbar from 'components/common/Scrollbar';
import NoResult from 'components/common/search/NoResult';
import SearchSkeleton from 'components/common/search/SearchSkeleton';
import SearchArea from 'components/common/SearchArea';
import TableHeader from 'components/common/table/TableHeader';
import PageLayout from 'components/layout';
import { SubjectTableHeading } from 'components/pages/subjects/SubjectHeading';
import SubjectRow from 'components/pages/subjects/SubjectRow';
import SubjectRowDialog from 'components/pages/subjects/SubjectRow/SubjectRowDialog';
import { useFilters } from 'hooks/useFilters';
import { useIsClient } from 'hooks/useIsClient';
import usePaginationQuery from 'hooks/usePaginationQuery';
import useTableSearch from 'hooks/useTableSearch';
import type { SubjectModel } from 'models/subject.model';
import type {
  ApiReturnData,
  DialogActionMode,
  NextPageWithLayout,
} from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';

const SubjectsPage: NextPageWithLayout = () => {
  const isClient = useIsClient();

  const { filterProps, additionalBaseQueryKey, additionalOtherArgs } =
    useFilters({
      objectName: 'môn học',
      commonFilterConfigs: {
        placeHolder: 'Bộ lọc',
        filterTypes: ['showInactive'],
      },
    });

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectModel>();

  const [mode, setMode] = useState<DialogActionMode>('view');

  const setModeEnhanced = (mode: DialogActionMode | 'hide') => {
    if (mode === 'hide') {
      setInfoDialogVisible(false);
      return;
    }

    setMode(mode);
    setInfoDialogVisible(true);
  };

  const { isLoading, paginatedRes, paginationComponent } = usePaginationQuery<
    SubjectModel[]
  >({
    baseQueryKey: ['subjects', ...additionalBaseQueryKey],
    fetchPaginationDataFn: fetchSubjects,
    otherArgs: {
      ...additionalOtherArgs,
    },
  });

  const queryClient = useQueryClient();
  // can either be delete or deactivate
  const { mutate: invokeDeletingSubject, isLoading: isDeletingSubject } =
    useMutation<ApiReturnData<typeof deleteSubject>, unknown, string>({
      mutationFn: (subjectId) => deleteSubject(subjectId),
      onSuccess: (statusCode) => {
        const operationName =
          statusCode === StatusCodes.NO_CONTENT ? 'Xoá' : 'Vô hiệu hoá';
        enqueueSnackbar(`${operationName} môn học thành công`, {
          variant: 'success',
        });

        queryClient.refetchQueries({
          queryKey: ['subjects'],
        });

        setSelectedSubject(undefined);
        setDeleteDialogVisible(false);
        // setMode('hide');
      },
      onError: getDefaultOnApiError({
        operationName: 'xoá/vô hiệu hoá môn học',
        onDone: () => setDeleteDialogVisible(false),
      }),
    });

  const {
    handleSearch,
    skeletonVisible,
    noResultVisible,
    recordsVisible,
    paginationComponentVisible,
    recordsToShow: subjects,
  } = useTableSearch<SubjectModel[]>({
    baseQueryKey: ['subjects', 'searchByName', ...additionalBaseQueryKey],
    fetchFunction: fetchSubjectsByName,
    paginatedRecords: paginatedRes?.data,
    isLoading,
    otherArgs: {
      ...additionalOtherArgs,
    },
  });

  return (
    <>
      <SEO title='Môn học' />
      <Box py={4}>
        <H2 mb={2}>Môn học</H2>
        <SearchArea
          searchProps={{
            handleSearch,
            placeHolder: 'Tìm theo tên môn học',
          }}
          addRecordButtonProps={{
            handleBtnClick: () => {
              setMode('add');
              setInfoDialogVisible(true);
            },
            text: 'Thêm môn học',
          }}
          filterProps={[filterProps[1]]}
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader heading={SubjectTableHeading} />
                {isClient && (
                  <TableBody>
                    {recordsVisible &&
                      subjects?.map((subject) => (
                        <SubjectRow
                          key={subject.id}
                          subject={subject}
                          setSelectedSubject={setSelectedSubject}
                          setDeleteDialogVisible={setDeleteDialogVisible}
                          setMode={setModeEnhanced}
                          setOpenDialog={setInfoDialogVisible}
                        />
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            {skeletonVisible && <SearchSkeleton />}
            {noResultVisible && <NoResult title='Không tìm thấy môn học' />}
          </Scrollbar>

          {paginationComponentVisible && (
            <Stack alignItems='center' my={4}>
              {paginationComponent}
            </Stack>
          )}
        </Card>
      </Box>
      <SubjectRowDialog
        handleClose={(_, reason) => {
          if (reason === 'backdropClick') return;
          setInfoDialogVisible(false);
        }}
        subject={selectedSubject}
        mode={mode}
        setMode={setModeEnhanced}
        infoDialogVisible={infoDialogVisible}
      />
      <ConfirmDialog
        open={deleteDialogVisible}
        handleClose={() => setDeleteDialogVisible(false)}
        handleConfirm={() => {
          if (selectedSubject) {
            invokeDeletingSubject(selectedSubject.id);
            return;
          }

          enqueueSnackbar(
            'Không tìm thấy môn học để xoá, vui lòng thử lại sau',
            {
              variant: 'error',
            },
          );
        }}
        isLoading={isDeletingSubject}
        title='Xác nhận'
        content={
          <Span>
            Bạn có chắc muốn{' '}
            {`${selectedSubject?.canDelete ? 'xoá ' : 'vô hiệu hoá '}`}
            <Span sx={{ fontWeight: 600 }}>{selectedSubject?.name}?</Span>
          </Span>
        }
      />
    </>
  );
};

SubjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default SubjectsPage;
