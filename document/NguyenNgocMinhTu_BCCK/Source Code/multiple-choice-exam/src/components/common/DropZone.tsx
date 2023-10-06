import { Box, Button, Divider } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { H5, Small } from 'components/abstract/Typography';

type DropZoneProps = {
  onChange: (files: File[]) => void;
  disabled: boolean;
};

const DropZone: FC<DropZoneProps> = ({ onChange, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => onChange(acceptedFiles),
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: { 'image/*': ['.png', '.jpeg', '.jpg'] },
  });

  const rootProps = disabled ? {} : getRootProps();
  const inputProps = disabled ? {} : getInputProps();

  return (
    <Box
      py={2}
      px={{ md: 10, xs: 4 }}
      display='flex'
      maxHeight='200px'
      alignItems='center'
      borderRadius='10px'
      border='1.5px dashed'
      flexDirection='column'
      borderColor='grey.300'
      justifyContent='center'
      textAlign='center'
      bgcolor={isDragActive ? 'grey.200' : 'grey.100'}
      sx={{
        transition: 'all 250ms ease-in-out',
        outline: 'none',
        cursor: disabled ? undefined : 'pointer',
      }}
      {...rootProps}
    >
      {!disabled && <input {...inputProps} />}
      <H5 mb={1} color='grey.600'>
        Kéo thả ảnh cho nội dung câu hỏi này
      </H5>

      <Divider
        sx={{ '::before, ::after': { borderColor: 'grey.300', width: 70 } }}
      >
        <Small color='text.disabled' px={1}>
          HOẶC
        </Small>
      </Divider>

      <Button
        type='button'
        variant='outlined'
        color='info'
        sx={{ px: 2, my: 2 }}
        disabled={disabled}
      >
        Chọn ảnh
      </Button>

      <Small color='grey.600'>
        Chỉ nhận các file định dạng ảnh (png, jpg, jpeg)
      </Small>
    </Box>
  );
};

export default DropZone;
