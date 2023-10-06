import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { NextHandler } from 'next-connect';
import { z } from 'zod';

import { authOptions } from '../../../pages/api/auth/[...nextauth]';

import { handleAccountError } from 'backend/handlers/api/profile.handler';
import { handleTestError } from 'backend/handlers/api/tests.handler';
import { UnauthorizedError } from 'backend/types/errors/profile';
import { InvalidPortionError } from 'backend/types/errors/test';

export const createSchemaValidationMiddleware =
  (schema: z.ZodSchema<Record<string, any>>) =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error));
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          data: error.issues.reduce((acc, current) => {
            acc[current.path.join('.')] = current.message;
            return acc;
          }, {}),
        });
      } else {
        console.log('========== UNEXPECTED VALIDATION ERROR ==========');
        console.log(error);
        console.log('=================================================');

        res.status(500).json({
          status: 'error',
          message: 'An unexpected error occurred',
        });
      }
    }
  };

export const createCheckPortionValidityMiddleware =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
      const easyPortion = Number(req.body.easyPortion);
      const normalPortion = Number(req.body.normalPortion);
      const hardPortion = Number(req.body.hardPortion);

      if (easyPortion + normalPortion + hardPortion !== 100) {
        throw new InvalidPortionError('invalid portion');
      }
      return next();
    } catch (error) {
      handleTestError(error, res);
    }
  };

export const createAccountSecurityMiddleware =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
      const userId = req.query.id as string;
      const session = (await getServerSession(
        req,
        res,
        authOptions,
      )) as Session;
      const requestingUserId = session.user.id;

      if (userId !== requestingUserId) {
        throw new UnauthorizedError(
          'Updating account information request denied',
        );
      }
      return next();
    } catch (error) {
      handleAccountError(error, res);
    }
  };
