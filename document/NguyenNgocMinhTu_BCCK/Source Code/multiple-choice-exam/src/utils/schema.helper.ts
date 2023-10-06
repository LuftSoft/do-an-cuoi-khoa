import { z } from 'zod';

import { capitalizeFirstChar } from './string.helper';

export const getStringToNumberSchema = (
  objectName: string,
  min: number,
  max: number,
) => {
  const limitErrorMessage = `${capitalizeFirstChar(
    objectName,
  )} phải trong khoảng từ ${min} - ${max}`;

  const isNaNErrorMessage = `${capitalizeFirstChar(objectName)} phải là số`;
  return z
    .string({
      required_error: `Vui lòng nhập ${objectName}`,
    })
    .refine(
      (valueAsString: string) => {
        return !isNaN(Number(valueAsString));
      },
      {
        message: isNaNErrorMessage,
      },
    )
    .refine(
      (valueAsString: string) => {
        const valueAsNumber = Number(valueAsString);
        return valueAsNumber >= min && valueAsNumber <= max;
      },
      {
        message: limitErrorMessage,
      },
    );
};
