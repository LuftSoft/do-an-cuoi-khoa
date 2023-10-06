import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormikContext } from 'formik';
import { type FC } from 'react';

import CustomTextField from '../CustomTextField';

import type { InputFieldProps } from './types';

import { getNewTime } from 'utils/date.helper';

type FormikTimePickerProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
  datePickerProps: NonNullable<InputFieldProps['datePickerProps']>;
};

const FormikTimePicker: FC<FormikTimePickerProps> = ({ commonInputProps }) => {
  const { touched, errors, setFieldValue, values } = useFormikContext<any>();

  const { name, label, disabled } = commonInputProps;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        disabled={disabled}
        PopperProps={{
          sx: {
            zIndex: 99999,
          },
        }}
        minutesStep={5}
        label={label}
        renderInput={(props) => (
          <CustomTextField
            {...(props as any)}
            fullWidth
            name={name}
            helperText={(touched[name] && errors[name]) as string}
            error={!!touched[name] && !!errors[name]}
            size='small'
          />
        )}
        inputFormat='hh:mm a'
        value={values[name]}
        onChange={(newDate: Date) => {
          const oldDate = values[name] as Date;
          setFieldValue(name, getNewTime(oldDate, newDate));
        }}
      />
    </LocalizationProvider>
  );
};

export default FormikTimePicker;
