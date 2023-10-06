import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Fade, IconButton, useTheme } from '@mui/material';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useRef, type FC, useState, memo } from 'react';
import { useHoverDirty } from 'react-use';

import QuestionActionMenu from './QuestionActionMenu';

import DifficultyChip from 'components/common/DifficultyChip';
import ShortenedStringWithTooltip from 'components/common/ShortenedStringWithTooltip';
import {
  StyledTableCell,
  StyledTableRow,
  getDefaultTableCellProps,
} from 'components/common/StyledComponents';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import type { SetModeEnhanced } from 'types/common';
import { getPlainTextFromHTML } from 'utils/string.helper';

type QuestionRowProps = {
  question: FullyPopulatedQuestionModel;
  setSelectedQuestion: Dispatch<
    SetStateAction<FullyPopulatedQuestionModel | undefined>
  >;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const QuestionRow: FC<QuestionRowProps> = ({
  question,
  setSelectedQuestion,
  setMode,
  setDeleteDialogVisible,
  setOpenDialog,
}) => {
  const { palette } = useTheme();
  const { difficulty, content, subject } = question;
  const hoverRef = useRef<Element>(null);
  const [actionMenuAnchor, setAnchorEl] = useState<EventTarget | null>(null);

  const handleActionButtonClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleRowClick = () => {
    setMode('view');
    setOpenDialog(true);
    setSelectedQuestion(question);
  };

  const actionMenuOpen = Boolean(actionMenuAnchor);
  const cellProps = getDefaultTableCellProps(handleRowClick, {
    color: !question.active ? palette.grey['disabled'] : undefined,
  });

  const isHovered = useHoverDirty(hoverRef);

  return (
    <>
      <StyledTableRow ref={hoverRef as any} tabIndex={-1} role='checkbox'>
        <StyledTableCell {...cellProps}>{subject?.name}</StyledTableCell>

        <StyledTableCell {...cellProps}>
          <ShortenedStringWithTooltip
            text={getPlainTextFromHTML(content)}
            htmlText={content}
            maxLength={75}
          />
        </StyledTableCell>

        <StyledTableCell {...cellProps}>
          <DifficultyChip difficulty={difficulty} />
        </StyledTableCell>

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

      <QuestionActionMenu
        anchorEl={actionMenuAnchor}
        handleClose={handleCloseActionMenu}
        open={actionMenuOpen}
        question={question}
        setSelectedQuestion={setSelectedQuestion}
        setDeleteDialogVisible={setDeleteDialogVisible}
        setMode={setMode}
      />
    </>
  );
};

export default memo(QuestionRow);
