import { StatusCodes } from 'http-status-codes';
import type { NextApiResponse } from 'next';

import type { SubjectEntity } from 'backend/entities/subject.entity';
import { RecordNotFoundError } from 'backend/types/errors/common';
import {
  IncorrectOldPasswordError,
  SamePasswordsError,
  UnauthorizedError,
} from 'backend/types/errors/profile';
import type { JSFail } from 'backend/types/jsend';

export const handleAccountError = (error: any, res: NextApiResponse) => {
  let errorCode: number | undefined;
  let data: JSFail<SubjectEntity>['data'];

  if (error instanceof RecordNotFoundError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Không tìm thấy tài khoản' };
  }

  if (error instanceof UnauthorizedError) {
    errorCode = StatusCodes.UNAUTHORIZED;
    data = { id: 'Bạn không có quyền cập nhật tài khoản này' };
  }

  if (error instanceof IncorrectOldPasswordError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Mật khẩu cũ không đúng' };
  }

  if (error instanceof SamePasswordsError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Mật khẩu cũ và mới không được giống nhau' };
  }

  if (data && errorCode) {
    res.status(errorCode).json(data);
    return;
  }

  throw error;
};
