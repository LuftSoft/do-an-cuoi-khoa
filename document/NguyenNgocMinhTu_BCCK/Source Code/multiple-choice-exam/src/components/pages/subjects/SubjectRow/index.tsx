import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Fade, IconButton, useTheme } from '@mui/material';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useRef, type FC, useState, memo } from 'react';
import { useHoverDirty } from 'react-use';

import SubjectActionMenu from './SubjectActionMenu';

import ShortenedStringWithTooltip from 'components/common/ShortenedStringWithTooltip';
import {
  StyledTableCell,
  StyledTableRow,
  getDefaultTableCellProps,
} from 'components/common/StyledComponents';
import type { SubjectModel } from 'models/subject.model';
import type { SetModeEnhanced } from 'types/common';

type SubjectRowProps = {
  subject: SubjectModel;
  setSelectedSubject: Dispatch<SetStateAction<SubjectModel | undefined>>;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const SubjectRow: FC<SubjectRowProps> = ({
  subject,
  setSelectedSubject,
  setMode,
  setDeleteDialogVisible,
  setOpenDialog,
}) => {
  const { name, description } = subject;
  const hoverRef = useRef<Element>(null);
  const [actionMenuAnchor, setAnchorEl] = useState<EventTarget | null>(null);
  const { palette } = useTheme();

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
    setSelectedSubject(subject);
  };

  const actionMenuOpen = Boolean(actionMenuAnchor);
  const cellProps = getDefaultTableCellProps(handleRowClick, {
    color: !subject.active ? palette.grey['disabled'] : undefined,
  });
  const isHovered = useHoverDirty(hoverRef);

  return (
    <>
      <StyledTableRow ref={hoverRef as any} tabIndex={-1} role='checkbox'>
        <StyledTableCell {...cellProps}>{name}</StyledTableCell>

        <StyledTableCell {...cellProps}>
          <ShortenedStringWithTooltip text={description} maxLength={100} />
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

      <SubjectActionMenu
        anchorEl={actionMenuAnchor}
        handleClose={handleCloseActionMenu}
        open={actionMenuOpen}
        subject={subject}
        setSelectedSubject={setSelectedSubject}
        setDeleteDialogVisible={setDeleteDialogVisible}
        setMode={setMode}
      />
    </>
  );
};

export default memo(SubjectRow);
