import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { TestEntity } from 'backend/entities/test.entity';
import { handleTestError } from 'backend/handlers/api/tests.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { TestService } from 'backend/services/test.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { ExamResult } from 'types/common';

type SuccessResponse = JSSuccess<ExamResult>;
type FailResponse = JSFail<TestEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler.post(async (req, res) => {
  try {
    const testId = req.query.id as string;
    const answers = req.body.answers;

    const examResult = await TestService.gradeMockTest(testId, answers);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: examResult,
    });
  } catch (error) {
    handleTestError(error, res);
  }
});

export default handler;
