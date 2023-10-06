import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { CircularProgress, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import {
  useEffect,
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
} from 'react';

import { MOCK_TEST_ROUTE } from 'constants/routes.constant';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type { SetModeEnhanced } from 'types/common';

type TestActionMenuProps = {
  anchorEl: EventTarget | null;
  open: boolean;
  handleClose: () => void;
  test: TestWithLecturerAndSubjectModel;
  setSelectedTest: Dispatch<
    SetStateAction<TestWithLecturerAndSubjectModel | undefined>
  >;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
  isTestDateValidToEdit: boolean;
  invokeComposeTestQuestions: (testId: string) => void;
  isComposingTestQuestions: boolean;
  areTestQuestionsValid: boolean;
};
const TestActionMenu: FC<TestActionMenuProps> = ({
  anchorEl,
  handleClose,
  open,
  test,
  setSelectedTest,
  setMode,
  setDeleteDialogVisible,
  isTestDateValidToEdit,
  invokeComposeTestQuestions,
  areTestQuestionsValid,
  isComposingTestQuestions,
}) => {
  useEffect(() => {
    if (!isComposingTestQuestions) {
      handleClose();
    }
  }, [handleClose, isComposingTestQuestions]);

  const router = useRouter();
  const [isChangingRoute, setIsChangingRoute] = useState(false);

  return (
    <Menu
      anchorEl={anchorEl as Element}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem
        onClick={() => {
          setMode('view');
          setSelectedTest(test);
          handleClose();
        }}
      >
        <ListItemIcon>
          <VisibilityRoundedIcon />
        </ListItemIcon>
        Chi tiết lịch thi
      </MenuItem>

      {areTestQuestionsValid && (
        <MenuItem
          onClick={() => {
            setIsChangingRoute(true);
            router.push(`${MOCK_TEST_ROUTE}/${test.id}`);
          }}
        >
          <ListItemIcon>
            {isChangingRoute ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              <EditCalendarRoundedIcon />
            )}
          </ListItemIcon>
          Thi thử
        </MenuItem>
      )}

      {isTestDateValidToEdit && [
        <MenuItem
          key={1}
          disabled={!isTestDateValidToEdit}
          onClick={() => {
            setMode('edit');
            setSelectedTest(test);
            handleClose();
          }}
        >
          <ListItemIcon>
            <ModeEditRoundedIcon />
          </ListItemIcon>
          Chỉnh sửa
        </MenuItem>,

        <MenuItem
          key={2}
          disabled={isComposingTestQuestions}
          onClick={() => {
            invokeComposeTestQuestions(test.id);
          }}
        >
          <ListItemIcon>
            {isComposingTestQuestions ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              <AssignmentRoundedIcon />
            )}
          </ListItemIcon>
          Tạo lại đề thi
        </MenuItem>,
        <MenuItem
          key={3}
          disabled={!isTestDateValidToEdit}
          onClick={() => {
            setDeleteDialogVisible(true);
            setSelectedTest(test);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteForeverRoundedIcon />
          </ListItemIcon>
          Xoá
        </MenuItem>,
      ]}
    </Menu>
  );
};

export default TestActionMenu;
