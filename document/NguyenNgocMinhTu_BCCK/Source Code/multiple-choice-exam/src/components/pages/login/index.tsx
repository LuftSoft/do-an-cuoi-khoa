import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useCallback, type FC, useState } from 'react';

import EyeToggleButton from './EyeToggleButton';
import type { LoginFormikValues } from './formik';
import { loginFormSchema, loginInitialValues } from './formik';
import { Wrapper } from './styled';

import { H1, H4, H6 } from 'components/abstract/Typography';
import CustomTextField from 'components/common/inputs/CustomTextField';
import MuiImage from 'components/image/MuiImage';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';

const Login: FC = () => {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const onSubmitForm = async (values: LoginFormikValues) => {
    setIsLoggingIn(true);
    const result = await signIn('credentials', { redirect: false, ...values });
    setInvalidCredentials(!result?.ok);

    if (result?.ok) {
      router.replace('/subjects');
      return;
    }
    setIsLoggingIn(false);
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: loginInitialValues,
      onSubmit: onSubmitForm,
      validationSchema: loginFormSchema,
    });

  return (
    <div>
      <MuiImage
        src='/assets/logos/blue-fav-full.svg'
        sx={{ m: 'auto', height: 70, mb: 3 }}
      />
      <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
        <form onSubmit={handleSubmit}>
          <H1 textAlign='center' mt={1} mb={4} fontSize={16}>
            Đăng nhập vào hệ thống
          </H1>

          <CustomTextField
            mb={1.5}
            fullWidth
            name='email'
            size='small'
            type='email'
            variant='outlined'
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            label='Email'
            placeholder='example@gmail.com'
            error={!!touched.email && !!errors.email}
            helperText={(touched.email && errors.email) as string}
          />

          <CustomTextField
            mb={4}
            fullWidth
            size='small'
            name='password'
            label='Mật khẩu'
            autoComplete='on'
            variant='outlined'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            placeholder='*********'
            type={passwordVisibility ? 'text' : 'password'}
            error={!!touched.password && !!errors.password}
            helperText={(touched.password && errors.password) as string}
            InputProps={{
              endAdornment: (
                <EyeToggleButton
                  show={passwordVisibility}
                  click={togglePasswordVisibility}
                />
              ),
            }}
          />

          <LoadingButton
            loading={isLoggingIn}
            loadingPosition='center'
            variant='contained'
            fullWidth
            name='submit'
            type='submit'
            color='primary'
            sx={{ height: 44 }}
          >
            Đăng nhập
          </LoadingButton>
        </form>

        {invalidCredentials && (
          <H4 mt={2} mb={4} textAlign='center' color='error.500'>
            Sai thông tin đăng nhập, vui lòng kiểm tra lại
          </H4>
        )}

        <FlexBox
          justifyContent='center'
          bgcolor='grey.200'
          borderRadius='4px'
          py={2}
          mt={2}
        >
          Quên mật khẩu?
          <Link href='/forgot-password' passHref legacyBehavior>
            <a>
              <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
                Khôi phục
              </H6>
            </a>
          </Link>
        </FlexBox>
      </Wrapper>
    </div>
  );
};

export default Login;
