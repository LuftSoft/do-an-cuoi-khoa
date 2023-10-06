import { FormControlLabel, Radio } from '@mui/material';
import type { FieldInputProps } from 'formik';

import CustomTextField from './CustomTextField';

import { Option } from 'backend/enums/question.enum';

interface RadioButtonWithTextFieldProps {
  name: string;
  label: string;
  disabled?: boolean;
  size?: 'small' | 'medium';

  radioProps: FieldInputProps<any>;
  textFieldProps: FieldInputProps<any>;

  error: boolean;
  helperText: string;
}

const RadioButtonWithTextField: React.FC<RadioButtonWithTextFieldProps> = ({
  name,
  label,
  disabled,
  size = 'small',
  error,
  helperText,
  radioProps,
  textFieldProps,
}) => {
  const getValueFromName = (): Option => {
    switch (name) {
      case 'optionA':
        return Option.A;
      case 'optionB':
        return Option.B;
      case 'optionC':
        return Option.C;
      case 'optionD':
        return Option.D;
      default:
        throw new Error('invalid name for RadioButtonWithTextField component');
    }
  };

  const value = getValueFromName();
  return (
    <FormControlLabel
      disabled={disabled}
      sx={{
        marginRight: '0',
        alignItems: 'flex-start',
        display: 'flex',
        '& > span:nth-child(2)': {
          flexGrow: '1',
        },
      }}
      control={
        <Radio
          sx={{
            mt: 3,
          }}
          {...radioProps}
          value={value}
          checked={radioProps.value === value}
          disabled={disabled}
        />
      }
      label={
        <CustomTextField
          {...textFieldProps}
          label={label}
          fullWidth
          error={error}
          helperText={helperText}
          multiline
          minRows={1}
          maxRows={3}
          disabled={disabled}
          size={size}
        />
      }
      labelPlacement='end'
    />
  );
};

export default RadioButtonWithTextField;
