import { fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';

import type { JSError } from 'backend/types/jsend';
import {
  API_BASE_ROUTE,
  BASE_ROUTE,
  FORGOT_PASSWORD_API_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  RESET_PASSWORD_API_ROUTE,
  RESET_PASSWORD_ROUTE,
  SUBJECTS_ROUTE,
} from 'constants/routes.constant';

const handleValidCredentials = (req: NextRequestWithAuth) => {
  if (req.url === BASE_ROUTE || req.url === LOGIN_ROUTE)
    return NextResponse.redirect(SUBJECTS_ROUTE);

  return undefined;
};

const handleUnauthorizedApiAccess = (req: NextRequestWithAuth) => {
  const response: JSError = {
    status: 'error',
    message: 'Unauthorized',
    code: StatusCodes.UNAUTHORIZED,
  };

  const apiWhitelist = [FORGOT_PASSWORD_API_ROUTE, RESET_PASSWORD_API_ROUTE];

  if (apiWhitelist.includes(req.url)) {
    return undefined;
  }

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.UNAUTHORIZED,
    headers: { 'content-type': 'application/json' },
  });
};

const handleRedirectingToPublicPages = (req: NextRequestWithAuth) => {
  const whitelist = [LOGIN_ROUTE, FORGOT_PASSWORD_ROUTE];
  // has query parameter, can' perform the "includes" method
  if (whitelist.includes(req.url) || req.url.startsWith(RESET_PASSWORD_ROUTE)) {
    return undefined;
  }
  return NextResponse.redirect(LOGIN_ROUTE);
};

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const hasValidToken = !!token && fromUnixTime(token.exp || 0) > new Date();

    const isApiRoute = req.url.startsWith(API_BASE_ROUTE);

    if (hasValidToken) {
      return handleValidCredentials(req);
    }

    if (isApiRoute) {
      return handleUnauthorizedApiAccess(req);
    }

    return handleRedirectingToPublicPages(req);
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: '/((?!404|assets/).*)',
};
