import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useMemo, type Dispatch, type FC, type SetStateAction } from 'react';

import { updateQuestion } from 'apiCallers/questions';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import type { ApiReturnData, SetModeEnhanced } from 'types/common';
import type { GetActivationLabel } from 'utils/common.helper';
import { getActivationLabel } from 'utils/common.helper';
import { getDefaultOnApiError } from 'utils/error.helper';

type QuestionActionMenuProps = {
  anchorEl: EventTarget | null;
  open: boolean;
  handleClose: () => void;
  question: FullyPopulatedQuestionModel;
  setSelectedQuestion: Dispatch<
    SetStateAction<FullyPopulatedQuestionModel | undefined>
  >;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
};
const QuestionActionMenu: FC<QuestionActionMenuProps> = ({
  anchorEl,
  handleClose,
  open,
  question,
  setSelectedQuestion,
  setMode,
  setDeleteDialogVisible,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data } = useSession();
  const lecturerId = data?.user.lecturer.id;
  const isAuthorizedToEditQuestion = lecturerId === question?.lecturer.id;

  const { activationLabel, icon } = useMemo(
    (): ReturnType<GetActivationLabel> =>
      getActivationLabel({
        active: question.active,
        canDelete: question.canDelete,
      }),
    [question.active, question.canDelete],
  );

  const { mutate: invokeActivateQuestion, isLoading: isActivatingQuestion } =
    useMutation<
      ApiReturnData<typeof updateQuestion>,
      unknown,
      { id: string; active: boolean }
    >({
      mutationFn: (data) => updateQuestion(data),
      onSuccess: () => {
        enqueueSnackbar('Kích hoạt câu hỏi thành công', {
          variant: 'success',
        });
      },
      onError: getDefaultOnApiError({
        operationName: `kích hoạt câu hỏi`,
      }),
      onSettled: () => {
        handleClose();
        queryClient.refetchQueries({
          queryKey: ['questions'],
        });
      },
    });

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
          setSelectedQuestion(question);
          handleClose();
        }}
      >
        <ListItemIcon>
          <VisibilityRoundedIcon />
        </ListItemIcon>
        Chi tiết
      </MenuItem>

      <Tooltip
        title={
          isAuthorizedToEditQuestion
            ? 'Chỉnh sửa câu hỏi'
            : 'Không thể chỉnh sửa câu hỏi của giảng viên khác'
        }
      >
        <span>
          <MenuItem
            disabled={!isAuthorizedToEditQuestion}
            onClick={() => {
              setMode('edit');
              setSelectedQuestion(question);
              handleClose();
            }}
          >
            <ListItemIcon>
              <ModeEditRoundedIcon />
            </ListItemIcon>
            Chỉnh sửa
          </MenuItem>
        </span>
      </Tooltip>

      <Tooltip
        title={
          isAuthorizedToEditQuestion
            ? 'Xoá câu hỏi'
            : 'Không thể xoá câu hỏi của giảng viên khác'
        }
      >
        <span>
          <MenuItem
            onClick={() => {
              if (activationLabel === 'Kích hoạt') {
                invokeActivateQuestion({
                  id: question.id,
                  active: true,
                });
                return;
              }
              setDeleteDialogVisible(true);
              setSelectedQuestion(question);
              handleClose();
            }}
          >
            <ListItemIcon>
              {isActivatingQuestion ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                icon
              )}
            </ListItemIcon>
            {activationLabel}
          </MenuItem>
        </span>
      </Tooltip>
    </Menu>
  );
};

export default QuestionActionMenu;
