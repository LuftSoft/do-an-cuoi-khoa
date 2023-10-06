import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { CircularProgress, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMemo, type Dispatch, type FC, type SetStateAction } from 'react';

import { updateSubject } from 'apiCallers/subjects';
import type { SubjectModel } from 'models/subject.model';
import type { ApiReturnData, SetModeEnhanced } from 'types/common';
import type { GetActivationLabel } from 'utils/common.helper';
import { getActivationLabel } from 'utils/common.helper';
import { getDefaultOnApiError } from 'utils/error.helper';

type SubjectActionMenuProps = {
  anchorEl: EventTarget | null;
  open: boolean;
  handleClose: () => void;
  subject: SubjectModel;
  setSelectedSubject: Dispatch<SetStateAction<SubjectModel | undefined>>;
  setMode: SetModeEnhanced;
  setDeleteDialogVisible: Dispatch<SetStateAction<boolean | undefined>>;
};
const SubjectActionMenu: FC<SubjectActionMenuProps> = ({
  anchorEl,
  handleClose,
  open,
  subject,
  setSelectedSubject,
  setMode,
  setDeleteDialogVisible,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { activationLabel, icon } = useMemo(
    (): ReturnType<GetActivationLabel> =>
      getActivationLabel({
        active: subject.active,
        canDelete: subject.canDelete,
      }),
    [subject.active, subject.canDelete],
  );

  const { mutate: invokeActivateSubject, isLoading: isActivatingSubject } =
    useMutation<
      ApiReturnData<typeof updateSubject>,
      unknown,
      { id: string; active: boolean }
    >({
      mutationFn: (data) => updateSubject(data),
      onSuccess: () => {
        enqueueSnackbar('Kích hoạt môn học thành công', {
          variant: 'success',
        });
      },
      onError: getDefaultOnApiError({
        operationName: `kích hoạt môn học`,
      }),
      onSettled: () => {
        handleClose();
        queryClient.refetchQueries({
          queryKey: ['subjects'],
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
          setSelectedSubject(subject);
          handleClose();
        }}
      >
        <ListItemIcon>
          <VisibilityRoundedIcon />
        </ListItemIcon>
        Chi tiết
      </MenuItem>

      <MenuItem
        onClick={() => {
          setMode('edit');
          setSelectedSubject(subject);
          handleClose();
        }}
      >
        <ListItemIcon>
          <ModeEditRoundedIcon />
        </ListItemIcon>
        Chỉnh sửa
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (activationLabel === 'Kích hoạt') {
            invokeActivateSubject({
              id: subject.id,
              active: true,
            });
            return;
          }
          setDeleteDialogVisible(true);
          setSelectedSubject(subject);
          handleClose();
        }}
      >
        <ListItemIcon>
          {isActivatingSubject ? (
            <CircularProgress size={24} color='inherit' />
          ) : (
            icon
          )}
        </ListItemIcon>
        {activationLabel}
      </MenuItem>
    </Menu>
  );
};

export default SubjectActionMenu;
