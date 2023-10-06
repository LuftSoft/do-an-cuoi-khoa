import { z } from 'zod';

import { AbstractSchema } from './abstract.model';

import { NAME_REGEX, PHONE_REGEX } from 'constants/regex.constant';

export const AccountSchema = AbstractSchema.extend({
  firstName: z
    .string({
      required_error: 'Vui lòng nhập tên',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(30)
    .regex(NAME_REGEX, {
      message: 'Tên chỉ được chứa chữ',
    }),
  lastName: z
    .string({
      required_error: 'Vui lòng nhập họ và tên lót',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(100)
    .regex(NAME_REGEX, {
      message: 'Tên chỉ được chứa chữ',
    }),
  phone: z
    .string({
      required_error: 'Vui lòng nhập số điện thoại',
    })
    .regex(PHONE_REGEX, {
      message: 'Vui lòng nhập đúng định dạng số điện thoại',
    }),
  avatarUrl: z.string().optional().nullable(),
  email: z
    .string({
      required_error: 'Vui lòng nhập email',
    })
    .email({
      message: 'Vui lòng nhập đúng định dạng email',
    }),
  password: z
    .string({
      required_error: 'Vui lòng nhập mật khẩu',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(500),

  lecturer: z.string().uuid().optional(),
  passwordReset: z.string().uuid().optional(),
});

export type AccountModel = z.infer<typeof AccountSchema>;
