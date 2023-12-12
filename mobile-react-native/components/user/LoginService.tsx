import axios from 'axios';
import {LoginModel} from './LoginModel';
import {ROUTE} from '../../routes/route.constant';

const USER_ROUTE = ROUTE.BASE_URL + ROUTE.USER;
export const LoginService = {
  login: async (data: LoginModel) => {
    try {
      return await axios.post(USER_ROUTE + ROUTE.LOGIN, data);
    } catch (err) {
      console.error('error when login: ', err);
    }
  },
  loginMobile: async (data: LoginModel) => {
    return await axios.post(USER_ROUTE + ROUTE.LOGIN + '/mobile', data);
  },
  signup: async (data: any) => {
    await axios.post(USER_ROUTE + ROUTE.SIGNUP, data);
  },
  updateUser: async (data: any) => {
    await axios.put(USER_ROUTE, data);
  },
};
