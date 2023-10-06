import { isPast } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { AccountEntity } from 'backend/entities/account.entity';
import { PasswordResetEntity } from 'backend/entities/passwordReset.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common.service';
import { InvalidResetPasswordTokenError } from 'backend/types/errors/profile';
import type { JSSuccess } from 'backend/types/jsend';
import { hashPassword } from 'backend/utils/auth.helper';

const handler = nc<NextApiRequest, NextApiResponse<JSSuccess<AccountEntity>>>(
  DEFAULT_NC_CONFIGS,
).patch(async (req, res) => {
  const token = req.body.token as string;
  const newPassword = req.body.newPassword as string;

  const passwordReset = await CommonService.getRecord({
    entity: PasswordResetEntity,
    filter: {
      token: token as string,
    },
    relations: ['account'],
  });

  const isTokenValid =
    !!passwordReset &&
    !passwordReset.used &&
    !isPast(passwordReset.expirationDate);
  if (!isTokenValid) {
    throw new InvalidResetPasswordTokenError('Token is used or in valid');
  }

  const updatedAccount = await CommonService.updateRecord(
    AccountEntity,
    passwordReset.account.id,
    {
      password: hashPassword(newPassword),
    },
  );

  await CommonService.updateRecord(PasswordResetEntity, passwordReset.id, {
    used: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedAccount,
  });
});

export default handler;
