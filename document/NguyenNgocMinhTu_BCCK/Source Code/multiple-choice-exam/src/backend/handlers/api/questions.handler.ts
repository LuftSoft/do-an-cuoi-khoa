import { StatusCodes } from 'http-status-codes';
import type { NextApiResponse } from 'next';

import type { QuestionEntity } from 'backend/entities/question.entity';
import { RecordNotFoundError } from 'backend/types/errors/common';
import { UnauthorizedLecturerError } from 'backend/types/errors/question';
import type { JSFail } from 'backend/types/jsend';

export const handleQuestionError = (error: any, res: NextApiResponse) => {
  let errorCode: number | undefined;
  let data: JSFail<QuestionEntity>['data'];

  if (error instanceof RecordNotFoundError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Không tìm thấy câu hỏi' };
  }

  if (error instanceof UnauthorizedLecturerError) {
    errorCode = StatusCodes.UNAUTHORIZED;
    data = { id: 'Không thể chỉnh sửa câu hỏi được tạo bởi giảng viên khác' };
  }

  if (data && errorCode) {
    res.status(errorCode).json(data);
    return;
  }
  throw error;
};
