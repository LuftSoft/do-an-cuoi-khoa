import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { NewSubjectDtoSchema } from 'backend/dtos/subject.dto';
import { SubjectEntity } from 'backend/entities/subject.entity';
import { handleSubjectError } from 'backend/handlers/api/subjects.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import { SubjectService } from 'backend/services/subject.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/utils/req.helper';

// console.log('------------');
// console.log(req.headers.cookie);
// console.log('------------');

type SuccessResponse = JSSuccess<SubjectEntity | SubjectEntity[]>;
type FailResponse = JSFail<SubjectEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const showInactive = req.query.showInactive;
    const keyword = req.query.keyword;

    const commonArgs = {
      entity: SubjectEntity,
      getAll: showInactive === 'true',
    };

    if (keyword) {
      const data = await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword: keyword as string,
          fieldName: 'name',
          limit: paginationParams.limit,
        },
      });

      const finalData = await SubjectService.addCanDeleteField(data);

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

      const finalData = await SubjectService.addCanDeleteField(data);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: finalData,
      });
    }
  })
  .post(
    createSchemaValidationMiddleware(NewSubjectDtoSchema),
    async (req, res) => {
      try {
        const data = await CommonService.createRecord(SubjectEntity, req.body);

        res.status(StatusCodes.CREATED).json({
          status: 'success',
          data,
        });
      } catch (error) {
        handleSubjectError(error, res);
      }
    },
  );

export default handler;
