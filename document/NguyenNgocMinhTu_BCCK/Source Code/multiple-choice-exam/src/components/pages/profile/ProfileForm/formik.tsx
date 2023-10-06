import type { Session } from 'next-auth';
import type { z } from 'zod';

import { NewAccountDtoSchema } from 'backend/dtos/profile.dto';
import type { Id } from 'types/common';

export const profileFormSchema = NewAccountDtoSchema;
export type ProfileFormikValues = z.infer<typeof profileFormSchema> & {
  degree: string;
} & Id;

export const getProfileFormInitialValues = (
  account: Session['user'],
): ProfileFormikValues => {
  return {
    ...account,
    firstName: account.firstName || '',
    lastName: account.lastName || '',
    email: account.email || '',
    phone: account.phone || '',
    degree: account.lecturer.degree,
  };
};
