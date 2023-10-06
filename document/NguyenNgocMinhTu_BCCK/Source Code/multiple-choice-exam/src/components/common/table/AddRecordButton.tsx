import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { FC } from 'react';

type AddRecordButtonProps = {
  text: string;
  handleBtnClick: () => void;
};

const AddRecordButton: FC<AddRecordButtonProps> = ({
  text,
  handleBtnClick,
}) => {
  return (
    <Button
      color='primary'
      variant='contained'
      startIcon={<Add />}
      onClick={handleBtnClick}
      sx={{ minHeight: 44 }}
    >
      {text}
    </Button>
  );
};

export default AddRecordButton;
