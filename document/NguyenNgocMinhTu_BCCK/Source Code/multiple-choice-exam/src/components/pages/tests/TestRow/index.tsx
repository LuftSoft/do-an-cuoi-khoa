import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Fade, IconButton, Tooltip, useTheme } from '@mui/material';
import type {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
} from 'react';
import { useRef, type FC, useState, memo, useCallback } from 'react';
import { useHoverDirty } from 'react-use';

import { getIsTestDateValidToEdit } from '../helpers';

import TestActionMenu from './TestActionMenu';

import { Span } from 'components/abstract/Typography';
import {
  StyledTableCell,
  StyledTableRow,
  getDefaultTableCellProps,
} from 'components/common/StyledComponents';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type { SetModeEnhanced } from 'types/common';
import {
  formatDateForDisplay,
  checkIsTestPast,
  checkIsTestHappening,
} from 'utils/date.helper';

type TestRowProps = {
  test: TestWithLecturerAndSubjectModel;
  setSelectedTest: Dispatch<
    SetStateAction<TestWithLecturerAndSubjectModel | undefined>
  >;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  invokeComposeTestQuestions: (testId: string) => void;
  isComposingTestQuestions: boolean;
};

const TestRow: FC<TestRowProps> = ({
  test,
  setSelectedTest,
  setMode,
  setDeleteDialogVisible,
  setOpenDialog,
  invokeComposeTestQuestions,
  isComposingTestQuestions,
}) => {
  const {
    durationMinutes,
    testDate,
    numberOfQuestions,
    subject,
    title,
    areTestQuestionsValid,
  } = test;
  const hoverRef = useRef<Element>(null);
  const [actionMenuAnchor, setAnchorEl] = useState<EventTarget | null>(null);
  const isTestDateValidToEdit = getIsTestDateValidToEdit(testDate);

  const isTestPast = checkIsTestPast(testDate, durationMinutes);
  const isTestHappening = checkIsTestHappening(testDate, durationMinutes);

  const theme = useTheme();

  const handleActionButtonClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActionMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleRowClick = () => {
    setMode('view');
    setOpenDialog(true);
    setSelectedTest(test);
  };

  const getRowColorAndMessage = () => {
    let message: ReactNode | undefined = undefined;
    let color: string | undefined = undefined;

    if (areTestQuestionsValid && isTestPast) {
      color = theme.palette.grey['disabled'];
      message = <Span>Lịch thi này đã kết thúc</Span>;
    }

    if (areTestQuestionsValid && isTestHappening) {
      color = theme.palette.primary.main;
      message = <Span>Lịch thi đang diễn ra</Span>;
    }

    if (!areTestQuestionsValid && isTestPast) {
      color = theme.palette.warning.main;
      message = <Span>Lịch thi này đã không diễn ra do không có đề thi</Span>;
    }

    if (!areTestQuestionsValid && isTestDateValidToEdit) {
      color = theme.palette.error.main;
      message = (
        <Span>
          Lịch thi này hiện không có đề thi, vui lòng thử lại với tuỳ chọn{' '}
          <Span fontWeight={500}>Tạo lại đề thi.</Span>
        </Span>
      );
    }

    return {
      color,
      message,
    };
  };

  const { color, message } = getRowColorAndMessage();

  const cellProps = getDefaultTableCellProps(handleRowClick, {
    color,
  });

  const actionMenuOpen = Boolean(actionMenuAnchor);

  const isHovered = useHoverDirty(hoverRef);

  return (
    <>
      <Tooltip title={message}>
        <StyledTableRow ref={hoverRef as any} tabIndex={-1} role='checkbox'>
          <StyledTableCell {...cellProps}>{title}</StyledTableCell>
          <StyledTableCell {...cellProps}>
            {/* <ShortenedStringWithTooltip input={description} maxLength={100} /> */}
            {subject.name}
          </StyledTableCell>
          <StyledTableCell {...cellProps}>
            {formatDateForDisplay(testDate)}
          </StyledTableCell>
          <StyledTableCell {...cellProps}>{numberOfQuestions}</StyledTableCell>
          <StyledTableCell {...cellProps}>{durationMinutes}</StyledTableCell>
          <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
            <Fade in={isHovered}>
              <IconButton
                aria-label='actions'
                size='small'
                onClick={handleActionButtonClick}
              >
                <MoreVertIcon fontSize='small' />
              </IconButton>
            </Fade>
          </StyledTableCell>
        </StyledTableRow>
      </Tooltip>

      <TestActionMenu
        anchorEl={actionMenuAnchor}
        handleClose={handleCloseActionMenu}
        open={actionMenuOpen}
        test={test}
        setSelectedTest={setSelectedTest}
        setDeleteDialogVisible={setDeleteDialogVisible}
        setMode={setMode}
        isTestDateValidToEdit={isTestDateValidToEdit}
        invokeComposeTestQuestions={invokeComposeTestQuestions}
        isComposingTestQuestions={isComposingTestQuestions}
        areTestQuestionsValid={areTestQuestionsValid}
      />
    </>
  );
};

export default memo(TestRow);
