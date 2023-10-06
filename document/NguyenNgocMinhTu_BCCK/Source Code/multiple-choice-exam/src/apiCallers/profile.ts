import { pick } from 'lodash';

import type {
  ChangePasswordWithIdDto,
  UpdateAccountWithIdDto,
} from 'backend/dtos/profile.dto';
import type { JSSuccess } from 'backend/types/jsend';
import { API_PROFILE_ROUTE } from 'constants/routes.constant';
import type { AccountModel } from 'models/account.model';
import myAxios from 'myAxios';

const BASE_URL = API_PROFILE_ROUTE;

export const updateAccount = async (
  accountInputs: UpdateAccountWithIdDto,
): Promise<AccountModel> => {
  const { id, ...inputs } = pick(accountInputs, [
    'id',
    'firstName',
    'lastName',
    'email',
    'phone',
    'avatarUrl',
  ]);
  const response = await myAxios.put<JSSuccess<AccountModel>>(
    `${BASE_URL}/${id}`,
    inputs,
  );
  const updatedAccount = response.data.data;
  return updatedAccount;
};

export const changePassword = async (
  accountInputs: ChangePasswordWithIdDto,
): Promise<AccountModel> => {
  const { id, ...passwordsInputs } = accountInputs;
  const response = await myAxios.put<JSSuccess<AccountModel>>(
    `${BASE_URL}/${id}/change-password`,
    passwordsInputs,
  );
  const updatedAccount = response.data.data;
  return updatedAccount;
};

export const sendResetPasswordRequest = async (
  email: string,
): Promise<string> => {
  const response = await myAxios.post<JSSuccess<string>>(
    `${BASE_URL}/forgot-password`,
    {
      email,
    },
  );
  const successMessage = response.data.data;
  return successMessage;
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<AccountModel> => {
  const response = await myAxios.patch<JSSuccess<AccountModel>>(
    `${BASE_URL}/reset-password`,
    {
      token,
      newPassword,
    },
  );
  const recoveredAccount = response.data.data;
  return recoveredAccount;
};
