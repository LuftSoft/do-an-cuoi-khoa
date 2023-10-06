import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';
import type { DeepPartial } from 'typeorm';

import { authOptions } from '../auth/[...nextauth]';

import { NewTestDtoSchema } from 'backend/dtos/test.dto';
import { TestEntity } from 'backend/entities/test.entity';
import { getTestElementFilter } from 'backend/filters/test';
import { handleTestError } from 'backend/handlers/api/tests.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import {
  createCheckPortionValidityMiddleware,
  createSchemaValidationMiddleware,
} from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { TestService } from 'backend/services/test.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { GetRecordInputs } from 'backend/types/service';
import {
  getArrayQuery,
  getPaginationParams,
  setPaginationHeader,
} from 'backend/utils/req.helper';

type SuccessResponse = JSSuccess<TestEntity | TestEntity[]>;
type FailResponse = JSFail<TestEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const session = (await getServerSession(req, res, authOptions)) as Session;
    // console.log('file: index.ts:40 - .get - session:', session);

    const lecturerId = session.user.lecturer.id;
    const subjectIds = getArrayQuery(req, 'subjectIds');
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword;

    const elementFilters = getTestElementFilter(req.query, lecturerId);
    const subjectFilters: DeepPartial<TestEntity>[] = subjectIds?.map((id) => ({
      subject: { id },
      ...elementFilters,
    }));

    const finalFilters = subjectIds ? subjectFilters : elementFilters;

    const commonArgs: GetRecordInputs<TestEntity> = {
      entity: TestEntity,
      relations: ['subject', 'lecturer'],
      filter: finalFilters,
      order: {
        testDate: 'DESC',
      },
    };

    if (keyword) {
      const data = await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword: keyword as string,
          fieldName: 'title',
          limit: paginationParams.limit,
        },
      });

      const finalData = await TestService.addAreTestQuestionsValidField(data);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: finalData,
      });
    } else {
      const [data, totalRecords] = await CommonService.getRecords({
        ...commonArgs,
        paginationParams,
      });

      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });

      const finalData = await TestService.addAreTestQuestionsValidField(data);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: finalData,
      });
    }
  })
  .post(
    createSchemaValidationMiddleware(NewTestDtoSchema),
    createCheckPortionValidityMiddleware(),
    async (req, res) => {
      try {
        const data = await CommonService.createRecord(TestEntity, req.body);

        res.status(StatusCodes.CREATED).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleTestError(error, res);
      }
    },
  );

export default handler;
