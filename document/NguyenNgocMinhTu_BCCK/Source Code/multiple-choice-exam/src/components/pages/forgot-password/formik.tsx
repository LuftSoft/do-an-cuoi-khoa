import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const forgotPasswordSchema = AccountSchema.pick({
  email: true,
});

export type ForgotPasswordFormikValues = z.infer<typeof forgotPasswordSchema>;
