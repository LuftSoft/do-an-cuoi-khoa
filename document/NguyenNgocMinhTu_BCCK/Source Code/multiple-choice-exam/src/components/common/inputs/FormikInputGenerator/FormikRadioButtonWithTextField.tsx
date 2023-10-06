import { useFormikContext } from 'formik';
import type { FC } from 'react';

import RadioButtonWithTextField from '../RadioButtonWithTextField';

import type { InputFieldProps } from './types';
type FormikRadioButtonWithTextFieldProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
  radioTextFieldProps: NonNullable<InputFieldProps['radioTextFieldProps']>;
};

const FormikRadioButtonWithTextField: FC<
  FormikRadioButtonWithTextFieldProps
> = ({ commonInputProps, radioTextFieldProps }) => {
  const { label, name, disabled } = commonInputProps;
  const { correctOptionName } = radioTextFieldProps;

  const { touched, errors, getFieldProps } = useFormikContext<any>();

  const radioProps = getFieldProps(correctOptionName);
  const textFieldProps = getFieldProps(name);

  return (
    <RadioButtonWithTextField
      name={name}
      label={label}
      disabled={disabled}
      radioProps={radioProps}
      textFieldProps={textFieldProps}
      error={!!touched[name] && !!errors[name]}
      helperText={(touched[name] && errors[name]) as string}
    />
  );
};

export default FormikRadioButtonWithTextField;
