import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormikContext } from 'formik';
import type { FC } from 'react';

import CustomTextField from '../CustomTextField';

import type { InputFieldProps } from './types';

import { getNewDate } from 'utils/date.helper';

type FormikDatePickerProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
  datePickerProps: NonNullable<InputFieldProps['datePickerProps']>;
};

const FormikDatePicker: FC<FormikDatePickerProps> = ({
  commonInputProps,
  datePickerProps,
}) => {
  const { touched, errors, setFieldValue, values } = useFormikContext<any>();
  const { name, label, disabled } = commonInputProps;
  const { minDate } = datePickerProps;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        minDate={minDate}
        disabled={disabled}
        PopperProps={{
          sx: {
            zIndex: 99999,
          },
        }}
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
        value={values[name]}
        onChange={(newDate: Date) => {
          const oldDate = values[name] as Date;
          setFieldValue(name, getNewDate(oldDate, newDate));
        }}
      />
    </LocalizationProvider>
  );
};

export default FormikDatePicker;
