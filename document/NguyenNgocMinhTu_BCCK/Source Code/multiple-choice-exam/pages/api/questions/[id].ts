import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { UpdateQuestionDtoSchema } from 'backend/dtos/question.dto';
import { QuestionEntity } from 'backend/entities/question.entity';
import { handleQuestionError } from 'backend/handlers/api/questions.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { QuestionService } from 'backend/services/question.service';
import { UnauthorizedLecturerError } from 'backend/types/errors/question';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<QuestionEntity | QuestionEntity[] | undefined>;
type FailResponse = JSFail<QuestionEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler
  .put(
    createSchemaValidationMiddleware(UpdateQuestionDtoSchema),
    async (req, res) => {
      try {
        const session = (await getServerSession(
          req,
          res,
          authOptions,
        )) as Session;
        const questionId = req.query.id as string;
        const lecturerId = session.user.lecturer.id;

        const editPermission = await QuestionService.checkEditPermission(
          questionId,
          lecturerId,
        );

        if (!editPermission) {
          throw new UnauthorizedLecturerError(
            'Cannot edit other lecturers question',
          );
        }

        const data = await CommonService.updateRecord(
          QuestionEntity,
          questionId,
          req.body,
        );

        res.status(StatusCodes.OK).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleQuestionError(error, res);
      }
    },
  )
  .delete(async (req, res) => {
    try {
      const session = (await getServerSession(
        req,
        res,
        authOptions,
      )) as Session;

      const questionId = req.query.id as string;
      const lecturerId = session.user.lecturer.id;

      const editPermission = await QuestionService.checkEditPermission(
        questionId,
        lecturerId,
      );

      if (!editPermission) {
        throw new UnauthorizedLecturerError(
          'Cannot edit other lecturers question',
        );
      }

      const canDeleteQuestion = await QuestionService.getCanDelete(questionId);
      if (canDeleteQuestion) {
        await CommonService.deleteRecord(QuestionEntity, questionId);
        res.status(StatusCodes.NO_CONTENT).send(undefined);
      } else {
        const deactivatedQuestion = await CommonService.updateRecord(
          QuestionEntity,
          questionId,
          {
            active: false,
          },
        );
        res.status(StatusCodes.OK).json({
          status: 'success',
          data: deactivatedQuestion,
        });
      }

      res.status(StatusCodes.NO_CONTENT).send(undefined);
    } catch (error) {
      handleQuestionError(error, res);
    }
  });

export default handler;
