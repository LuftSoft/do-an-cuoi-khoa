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
import { AccountService } from 'backend/services/account.service';
import { CommonService } from 'backend/services/common.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import { hashPassword } from 'backend/utils/auth.helper';
type SuccessResponse = JSSuccess<AccountEntity>;
type FailResponse = JSFail<AccountEntity>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse | undefined>
>(DEFAULT_NC_CONFIGS);

handler.put(
  createSchemaValidationMiddleware(UpdateAccountDtoSchema),
  createAccountSecurityMiddleware(),
  async (req, res) => {
    try {
      const userId = req.query.id as string;

      const oldPassword = req.body.oldPassword as string;
      const newPassword = req.body.newPassword as string;

      await AccountService.validatePasswords({
        oldPassword,
        newPassword,
        userId,
      });

      await CommonService.updateRecord(AccountEntity, userId, {
        password: hashPassword(newPassword),
      });

      res.status(StatusCodes.NO_CONTENT).send(undefined);
    } catch (error) {
      handleAccountError(error, res);
    }
  },
);

export default handler;
