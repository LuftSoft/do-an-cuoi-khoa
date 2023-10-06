import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { MailService } from 'backend/services/mailer.service';
import type { JSSuccess } from 'backend/types/jsend';

const handler = nc<NextApiRequest, NextApiResponse<JSSuccess<string>>>(
  DEFAULT_NC_CONFIGS,
).post(async (req, res) => {
  await MailService.sendResetPasswordEmail(req.body.email);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'Reset password email sent',
  });
});

export default handler;
