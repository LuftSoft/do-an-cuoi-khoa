import { useFormikContext } from 'formik';
import type { FC } from 'react';

import CustomTextField from '../CustomTextField';

import { InputType, type InputFieldProps } from './types';

type FormikTextFieldAreaProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
};

const FormikTextFieldArea: FC<FormikTextFieldAreaProps> = ({
  commonInputProps,
}) => {
  const { touched, handleBlur, handleChange, values, errors } =
    useFormikContext<any>();

  const { name, type, label, disabled, InputProps, htmlType } =
    commonInputProps;

  return (
    <CustomTextField
      fullWidth
      size='small'
      name={name}
      label={label}
      multiline={type === InputType.TEXT_AREA}
      minRows={type === InputType.TEXT_AREA ? 3 : undefined}
      maxRows={type === InputType.TEXT_AREA ? 3 : undefined}
      value={values[name]}
      onBlur={handleBlur}
      onChange={handleChange}
      type={htmlType}
      error={!!touched[name] && !!errors[name]}
      helperText={(touched[name] && errors[name]) as string}
      disabled={disabled}
      InputProps={InputProps}
    />
  );
};

export default FormikTextFieldArea;
