import { type Breakpoint } from '@mui/system';
import type { FC, ReactNode } from 'react';

import DefaultDialog from './DefaultDialog';

import type { GeneralFunction } from 'types/common';

type ConfirmDialogProps = {
  open: boolean;
  handleClose: GeneralFunction;
  title?: string;
  handleConfirm?: GeneralFunction;
  color?: 'warning' | 'info';
  content?: ReactNode;
  isLoading?: boolean;
  maxWidth?: Breakpoint;
};
const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  handleClose,
  handleConfirm,
  color = 'warning',
  maxWidth = 'xs',
  title,
  content,
  isLoading = false,
}) => {
  return (
    <DefaultDialog
      maxWidth={maxWidth}
      open={open}
      handleClose={handleClose}
      title={title}
      action={{
        handleConfirm,
        handleCancel: handleClose,
        color,
      }}
      isLoading={isLoading}
      content={content}
    />
  );
};

export default ConfirmDialog;
