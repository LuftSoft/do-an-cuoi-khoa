import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import type { Breakpoint } from '@mui/material';
import { Grow, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { TransitionProps } from '@mui/material/transitions';
import type { FC } from 'react';
import { forwardRef } from 'react';

import type { GeneralFunction, HandleCloseDialog } from 'types/common';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

type DefaultDialogProps = {
  title?: string;
  content?: React.ReactNode;
  maxWidth?: Breakpoint;
  fullWidth?: boolean;
  open: boolean;
  isLoading?: boolean;
  handleClose: HandleCloseDialog;
  keepMounted?: boolean;
  action?: {
    handleConfirm?: GeneralFunction;
    handleCancel?: GeneralFunction;
    confirmText?: string;
    cancelText?: string;
    color?: 'warning' | 'error' | 'info';
  };
};
const DefaultDialog: FC<DefaultDialogProps> = ({
  title,
  content,
  maxWidth,
  fullWidth = false,
  isLoading = false,
  handleClose,
  keepMounted = false,
  open,
  action,
}) => {
  const defaultCancelText = 'Huỷ';
  const defaultConfirmText = 'Đồng ý';
  const { cancelText, confirmText, handleCancel, handleConfirm, color } =
    action || {};

  let finalColor = color || 'info';

  // Don't want to use yellow color here, but don't want to break the theme either
  if (finalColor === 'warning') finalColor = 'error';

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        TransitionComponent={Transition}
        keepMounted={keepMounted}
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        {title && (
          <DialogTitle>
            {title}

            {handleClose ? (
              <IconButton
                aria-label='close'
                onClick={handleClose as any}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
        )}

        <DialogContent>{content}</DialogContent>

        {(handleCancel || handleConfirm) && (
          <DialogActions>
            {handleCancel && (
              <Button
                disabled={isLoading}
                onClick={handleCancel}
                color={finalColor}
              >
                {cancelText || defaultCancelText}
              </Button>
            )}
            {handleConfirm && (
              <LoadingButton
                loading={isLoading}
                onClick={handleConfirm}
                color={finalColor}
              >
                {confirmText || defaultConfirmText}
              </LoadingButton>
            )}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default DefaultDialog;
