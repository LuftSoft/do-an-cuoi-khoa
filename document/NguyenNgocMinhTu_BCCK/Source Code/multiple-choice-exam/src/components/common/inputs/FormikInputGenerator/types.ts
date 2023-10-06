import type { Grid, InputProps } from '@mui/material';
import type { ComponentProps } from 'react';

export enum InputType {
  TEXT_FIELD,
  TEXT_AREA,
  AUTO_COMPLETE,
  RADIO_TEXT_FIELD,
  DATE_PICKER,
  TIME_PICKER,
  QUILL_EDITOR,
}

export type InputFieldProps<
  TName extends Record<string, any> = Record<string, any>,
> = {
  commonInputProps: {
    name: keyof TName;
    label: string;
    type: InputType;
    htmlType?: string;
    placeholder?: string;
    disabled?: boolean;
    InputProps?: Partial<InputProps>;
  };

  autoCompleteProps?: {
    getOptionLabel: (option: Record<string, any>) => string;
    options: Record<string, any>[] | undefined;
  };

  datePickerProps?: {
    minDate: Date;
  };

  timePickerProps?: {};

  radioTextFieldProps?: {
    correctOptionName: string;
    isCorrectOption: boolean;
  };

  gridProps: ComponentProps<typeof Grid>;
};
