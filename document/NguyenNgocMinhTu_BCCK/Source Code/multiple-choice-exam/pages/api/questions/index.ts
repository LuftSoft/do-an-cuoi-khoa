import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { NewQuestionDtoSchema } from 'backend/dtos/question.dto';
import { QuestionEntity } from 'backend/entities/question.entity';
import { getQuestionElementFilter } from 'backend/filters/question';
import { handleQuestionError } from 'backend/handlers/api/questions.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { QuestionService } from 'backend/services/question.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import {
  getArrayQuery,
  getPaginationParams,
  setPaginationHeader,
} from 'backend/utils/req.helper';

type RealQuestionEntity = Omit<
  QuestionEntity,
  'decryptFields' | 'encryptFields'
>;
type SuccessResponse = JSSuccess<RealQuestionEntity | RealQuestionEntity[]>;
type FailResponse = JSFail<RealQuestionEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const session = (await getServerSession(req, res, authOptions)) as Session;

    const lecturerId = session.user.lecturer.id;
    const subjectIds = getArrayQuery(req, 'subjectIds');
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;

    const elementFilters = getQuestionElementFilter(req.query, lecturerId);

    const [data, totalRecords] =
      await QuestionService.getQuestionsWithActiveSubjects({
        paginationParams,
        subjectIds,
        contentKeyword: keyword,
        simpleFilters: elementFilters,
      });

    if (!keyword) {
      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });
    }

    const finalData = await QuestionService.addCanDeleteField(data);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: finalData,
    });
  })
  .post(
    createSchemaValidationMiddleware(NewQuestionDtoSchema),
    async (req, res) => {
      try {
        const data = await CommonService.createRecord(QuestionEntity, req.body);

        res.status(StatusCodes.CREATED).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleQuestionError(error, res);
      }
    },
  );

export default handler;
