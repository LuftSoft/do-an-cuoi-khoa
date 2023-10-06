import { Autocomplete } from '@mui/material';
import { useFormikContext } from 'formik';
import type { FC } from 'react';

import CustomTextField from '../CustomTextField';

import type { InputFieldProps } from './types';

type FormikAutoCompleteProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
  autoCompleteProps: NonNullable<InputFieldProps['autoCompleteProps']>;
};

const FormikAutoComplete: FC<FormikAutoCompleteProps> = ({
  commonInputProps,
  autoCompleteProps,
}) => {
  const { touched, handleBlur, values, errors, setFieldValue } =
    useFormikContext<any>();

  const { name, label, disabled, placeholder } = commonInputProps;
  const { getOptionLabel, options } = autoCompleteProps;

  return (
    <Autocomplete
      fullWidth
      options={options || []}
      value={values[name]}
      getOptionLabel={getOptionLabel}
      onChange={(_, value) => {
        setFieldValue(name, value);
      }}
      placeholder={placeholder}
      noOptionsText='Không có môn học nào...'
      disabled={disabled}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          onBlur={handleBlur}
          label={label}
          error={!!touched[name] && !!errors[name]}
          helperText={(touched[name] && errors[name]) as string}
          size='small'
        />
      )}
    />
  );
};

export default FormikAutoComplete;
