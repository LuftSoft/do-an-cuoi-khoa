import * as yup from 'yup';

export type LoginFormikValues = {
  email: string;
  password: string;
};

export const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Vui lòng nhập email hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export const loginInitialValues: LoginFormikValues = {
  email: '',
  password: '',
};
