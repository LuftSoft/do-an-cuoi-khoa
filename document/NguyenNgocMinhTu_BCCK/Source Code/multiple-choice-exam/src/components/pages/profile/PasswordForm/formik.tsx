import { z } from 'zod';

export const basePasswordFormSchema = z.object({
  oldPassword: z
    .string({
      required_error: 'Vui lòng nhập mật khẩu cũ',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(100),
  newPassword: z
    .string({
      required_error: 'Vui lòng nhập mật khẩu mới',
    })
    .min(10, {
      message: 'Mật khẩu phải chứa ít nhất 10 ký tự',
    })
    .max(50, {
      message: 'Mật khẩu không quá 50 ký tự',
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt',
    })
    .refine((value) => /\d/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một số',
    }),
  confirmNewPassword: z.string({
    required_error: 'Vui lòng xác nhận mật khẩu mới',
  }),
});

export const passwordFormSchema = basePasswordFormSchema.refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: 'Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau',
    path: ['confirmNewPassword'], // This makes sure the error is attached to the confirmNewPassword field
  },
);

export type PasswordFormikValues = z.infer<typeof passwordFormSchema>;

export const getPasswordFormInitialValues = (): PasswordFormikValues => {
  return {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
};
