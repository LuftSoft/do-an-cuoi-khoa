import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { SubjectEntity } from 'backend/entities/subject.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { SubjectDropdownModel } from 'models/subject.model';

type SuccessResponse = JSSuccess<SubjectDropdownModel[]>;
type FailResponse = JSFail<SubjectDropdownModel>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.get(async (_, res) => {
  const [data] = await CommonService.getRecords({
    entity: SubjectEntity,
    select: ['id', 'name'],
    paginationParams: {
      limit: 1000,
      page: 1,
    },
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
