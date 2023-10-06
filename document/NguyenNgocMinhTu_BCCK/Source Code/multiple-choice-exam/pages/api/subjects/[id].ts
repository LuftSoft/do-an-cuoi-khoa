import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateSubjectDtoSchema } from 'backend/dtos/subject.dto';
import { SubjectEntity } from 'backend/entities/subject.entity';
import { handleSubjectError } from 'backend/handlers/api/subjects.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { SubjectService } from 'backend/services/subject.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
type SuccessResponse = JSSuccess<SubjectEntity | SubjectEntity[] | undefined>;
type FailResponse = JSFail<SubjectEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler
  .put(
    createSchemaValidationMiddleware(UpdateSubjectDtoSchema),
    async (req, res) => {
      const subjectId = req.query.id as string;
      try {
        const data = await CommonService.updateRecord(
          SubjectEntity,
          subjectId,
          req.body,
        );

        res.status(StatusCodes.OK).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleSubjectError(error, res);
      }
    },
  )
  .delete(async (req, res) => {
    try {
      const subjectId = req.query.id as string;
      const canDeleteSubject = await SubjectService.getCanDelete(subjectId);
      if (canDeleteSubject) {
        await CommonService.deleteRecord(SubjectEntity, subjectId);
        res.status(StatusCodes.NO_CONTENT).send(undefined);
      } else {
        const deactivatedSubject = await CommonService.updateRecord(
          SubjectEntity,
          subjectId,
          {
            active: false,
          },
        );
        res.status(StatusCodes.OK).json({
          status: 'success',
          data: deactivatedSubject,
        });
      }
    } catch (error) {
      handleSubjectError(error, res);
    }
  });

export default handler;
