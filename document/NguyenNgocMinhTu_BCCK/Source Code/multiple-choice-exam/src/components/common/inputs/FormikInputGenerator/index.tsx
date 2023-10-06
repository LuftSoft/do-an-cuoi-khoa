import { Grid } from '@mui/material';

import FormikAutoComplete from './FormikAutoComplete';
import FormikDatePicker from './FormikDatePicker';
import FormikQuillEditor from './FormikQuillEditor';
import FormikRadioButtonWithTextField from './FormikRadioButtonWithTextField';
import FormikTextFieldArea from './FormikTextFieldArea';
import FormikTimePicker from './FormikTimePicker';
import { InputType, type InputFieldProps } from './types';

type InputGeneratorProps<TName extends Record<string, any>> = {
  inputFieldProps: InputFieldProps<TName>[];
};

const FormikInputGenerator = <TName extends Record<string, any>>({
  inputFieldProps,
}: InputGeneratorProps<TName>): JSX.Element => {
  const getInputComponent = (inputType: InputType) => {
    switch (inputType) {
      case InputType.TEXT_FIELD:
      case InputType.TEXT_AREA:
        return FormikTextFieldArea;

      case InputType.AUTO_COMPLETE:
        return FormikAutoComplete;

      case InputType.RADIO_TEXT_FIELD:
        return FormikRadioButtonWithTextField;

      case InputType.DATE_PICKER:
        return FormikDatePicker;

      case InputType.TIME_PICKER:
        return FormikTimePicker;

      case InputType.QUILL_EDITOR:
        return FormikQuillEditor;

      default:
        return FormikTextFieldArea;
    }
  };

  return (
    <>
      {inputFieldProps.map(
        ({
          commonInputProps,
          gridProps,
          autoCompleteProps,
          radioTextFieldProps,
          datePickerProps,
          timePickerProps,
        }) => {
          const Component = getInputComponent(commonInputProps.type) as any;
          const type = commonInputProps.type;
          let renderedComponent: JSX.Element;

          switch (type) {
            case InputType.TEXT_FIELD:
            case InputType.TEXT_AREA:
            case InputType.QUILL_EDITOR:
              renderedComponent = (
                <Component commonInputProps={commonInputProps} />
              );
              break;

            case InputType.AUTO_COMPLETE:
              renderedComponent = (
                <Component
                  commonInputProps={commonInputProps}
                  autoCompleteProps={autoCompleteProps || {}}
                />
              );
              break;

            case InputType.RADIO_TEXT_FIELD:
              renderedComponent = (
                <Component
                  commonInputProps={commonInputProps}
                  radioTextFieldProps={radioTextFieldProps || {}}
                />
              );
              break;

            case InputType.DATE_PICKER:
              renderedComponent = (
                <Component
                  commonInputProps={commonInputProps}
                  datePickerProps={datePickerProps || {}}
                />
              );
              break;

            case InputType.TIME_PICKER:
              renderedComponent = (
                <Component
                  commonInputProps={commonInputProps}
                  timePickerProps={timePickerProps || {}}
                />
              );
              break;
          }
          return (
            <Grid item key={commonInputProps.name as string} {...gridProps}>
              {renderedComponent}
            </Grid>
          );
        },
      )}
    </>
  );
};

export default FormikInputGenerator;
