import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateAccountDtoSchema } from 'backend/dtos/profile.dto';
import { AccountEntity } from 'backend/entities/account.entity';
import { handleAccountError } from 'backend/handlers/api/profile.handler';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import {
  createAccountSecurityMiddleware,
  createSchemaValidationMiddleware,
} from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
type SuccessResponse = JSSuccess<AccountEntity>;
type FailResponse = JSFail<AccountEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.put(
  createSchemaValidationMiddleware(UpdateAccountDtoSchema),
  createAccountSecurityMiddleware(),
  async (req, res) => {
    const accountId = req.query.id as string;
    console.log('file: [id].ts:29 - req.body:', req.body);

    try {
      const data = await CommonService.updateRecord(
        AccountEntity,
        accountId,
        req.body,
      );
      console.log('file: [id].ts:32 - data:', data);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    } catch (error) {
      handleAccountError(error, res);
    }
  },
);

export default handler;
