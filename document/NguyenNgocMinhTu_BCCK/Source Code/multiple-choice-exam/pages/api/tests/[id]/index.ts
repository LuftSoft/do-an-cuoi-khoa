import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateTestDtoSchema } from 'backend/dtos/test.dto';
import { TestEntity } from 'backend/entities/test.entity';
import { handleTestError } from 'backend/handlers/api/tests.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import {
  createCheckPortionValidityMiddleware,
  createSchemaValidationMiddleware,
} from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { TestService } from 'backend/services/test.service';
import { TestExpiredError } from 'backend/types/errors/test';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { TestForExamModel } from 'models/test.model';

type SuccessResponse = JSSuccess<TestEntity | TestEntity[] | TestForExamModel>;
type FailResponse = JSFail<TestEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const testId = req.query.id as string;
    const fullyPopulatedTest = await TestService.getTestForExam(testId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: fullyPopulatedTest,
    });
  })
  .put(
    createSchemaValidationMiddleware(UpdateTestDtoSchema),
    createCheckPortionValidityMiddleware(),
    async (req, res) => {
      try {
        const testId = req.query.id as string;
        const editPermission = await TestService.checkEditPermission(testId);
        if (!editPermission) {
          throw new TestExpiredError(
            'Cannot edit expired test (1 hour before testDate)',
          );
        }

        const data = await CommonService.updateRecord(
          TestEntity,
          testId,
          req.body,
        );

        res.status(StatusCodes.OK).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleTestError(error, res);
      }
    },
  )
  .delete(async (req, res) => {
    try {
      const testId = req.query.id as string;

      const editPermission = await TestService.checkEditPermission(testId);
      if (!editPermission) {
        throw new TestExpiredError(
          'Cannot edit expired test (1 hour before testDate)',
        );
      }

      await CommonService.deleteRecord(TestEntity, testId);
      res.status(StatusCodes.NO_CONTENT).send(undefined);
    } catch (error) {
      handleTestError(error, res);
    }
  });

export default handler;
