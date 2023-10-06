import type { z } from 'zod';

import { basePasswordFormSchema } from 'components/pages/profile/PasswordForm/formik';
import { AccountSchema } from 'models/account.model';
import type { Id } from 'types/common';

export const NewAccountDtoSchema = AccountSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatarUrl: true,
});

export const UpdateAccountDtoSchema = NewAccountDtoSchema.partial();

export type NewAccountDto = z.infer<typeof NewAccountDtoSchema>;
export type UpdateAccountDto = z.infer<typeof UpdateAccountDtoSchema>;
export type UpdateAccountWithIdDto = z.infer<typeof UpdateAccountDtoSchema> &
  Id;

export const ChangePasswordDtoSchema = basePasswordFormSchema.pick({
  oldPassword: true,
  newPassword: true,
});

export type ChangePasswordWithIdDto = z.infer<typeof ChangePasswordDtoSchema> &
  Id;
