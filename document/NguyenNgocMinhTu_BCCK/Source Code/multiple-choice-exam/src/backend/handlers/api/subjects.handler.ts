import { StatusCodes } from 'http-status-codes';
import type { NextApiResponse } from 'next';

import type { SubjectEntity } from 'backend/entities/subject.entity';
import {
  DuplicationError,
  RecordNotFoundError,
} from 'backend/types/errors/common';
import type { JSFail } from 'backend/types/jsend';

export const handleSubjectError = (error: any, res: NextApiResponse) => {
  let errorCode: number | undefined;
  let data: JSFail<SubjectEntity>['data'];

  if (error instanceof RecordNotFoundError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Không tìm thấy môn học' };
  }

  if (error instanceof DuplicationError) {
    errorCode = StatusCodes.CONFLICT;
    data = { name: 'Tên môn học đã tồn tại' };
  }

  if (data && errorCode) {
    res.status(errorCode).json(data);
    return;
  }
  throw error;
};
