import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { TestEntity } from 'backend/entities/test.entity';
import { Difficulty } from 'backend/enums/question.enum';
import { RecordNotFoundError } from 'backend/types/errors/common';
import {
  InvalidPortionError,
  NotEnoughQuestionError,
  TestExpiredError,
} from 'backend/types/errors/test';
import type { JSFail } from 'backend/types/jsend';

export const handleTestError = (error: any, res: NextApiResponse) => {
  let errorCode: number | undefined;
  let data: JSFail<TestEntity>['data'];

  if (error instanceof RecordNotFoundError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { id: 'Không tìm thấy lịch thi' };
  }

  if (error instanceof InvalidPortionError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = {
      easyPortion: 'Tổng tỉ lệ câu hỏi phải bằng 100%',
      normalPortion: 'Tổng tỉ lệ câu hỏi phải bằng 100%',
      hardPortion: 'Tổng tỉ lệ câu hỏi phải bằng 100%',
    };
  }

  if (error instanceof NotEnoughQuestionError) {
    errorCode = StatusCodes.BAD_REQUEST;
    switch (error.difficulty) {
      case Difficulty.EASY:
        data = {
          easyPortion: `Tạo đề thi thất bại do thiếu ${error.missing} câu dễ`,
        };
        break;

      case Difficulty.NORMAL:
        data = {
          normalPortion: `Tạo đề thi thất bại do thiếu ${error.missing} câu trung bình`,
        };
        break;

      case Difficulty.HARD:
        data = {
          hardPortion: `Tạo đề thi thất bại do thiếu ${error.missing} câu khó`,
        };
        break;

      default:
        break;
    }
  }

  if (error instanceof TestExpiredError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = {
      id: 'Không thể chỉnh sửa lịch thi đã quá hạn (1 tiếng trước khi thi)',
    };
  }

  if (data && errorCode) {
    res.status(errorCode).json(data);
    return;
  }
  throw error;
};

export const checkPortionsValidity = (req: NextApiRequest) => {
  const easyPortion = Number(req.body.easyPortion);
  const normalPortion = Number(req.body.normalPortion);
  const hardPortion = Number(req.body.hardPortion);

  if (easyPortion + normalPortion + hardPortion !== 100) {
    throw new InvalidPortionError('invalid portion');
  }
};
