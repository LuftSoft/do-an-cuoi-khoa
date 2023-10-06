import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { QuestionEntity } from 'backend/entities/question.entity';
import type { TestEntity } from 'backend/entities/test.entity';
import { handleTestError } from 'backend/handlers/api/tests.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { TestService } from 'backend/services/test.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<QuestionEntity[]>;
type FailResponse = JSFail<TestEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler.put(async (req, res) => {
  try {
    const testId = req.query.id as string;
    await TestService.cleanupOldTestQuestions(testId);
    const questions = await TestService.composeTestQuestions(testId);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: questions,
    });
  } catch (error) {
    handleTestError(error, res);
  }
});

export default handler;
