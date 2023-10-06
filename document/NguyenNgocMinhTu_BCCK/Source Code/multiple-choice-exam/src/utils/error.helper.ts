import type { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

import type { GeneralFunction } from 'types/common';

export const extractErrorMessages = (
  responseData: Record<string, string>,
): string[] => {
  return Object.keys(responseData).map(
    (errorProperty) => responseData[errorProperty],
  );
};

export type GetDefaultOnApiErrorInputs = {
  operationName: string;
  onDone?: GeneralFunction;
};
export const getDefaultOnApiError =
  ({ operationName, onDone }: GetDefaultOnApiErrorInputs) =>
  (error: AxiosError) => {
    const responseData = error.response?.data as Record<string, string>;

    if (!responseData) {
      enqueueSnackbar(
        `Đã xảy ra lỗi khi ${operationName}, vui lòng thử lại sau`,
        {
          variant: 'error',
        },
      );
      onDone?.();
      return;
    }

    extractErrorMessages(responseData).map((message) => {
      enqueueSnackbar(message, {
        variant: 'error',
      });
    });
    onDone?.();
  };

export const notifyUnexpectedError = () =>
  enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
    variant: 'error',
  });
