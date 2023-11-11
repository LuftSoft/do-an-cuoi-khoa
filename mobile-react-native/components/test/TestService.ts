import axios from 'axios';
import {ROUTE} from '../../routes/route.constant';

const USER_ROUTE = ROUTE.BASE_URL + ROUTE.USER;
const TEST_ROUTE = ROUTE.BASE_URL + ROUTE.TEST;
const RESULT_ROUTE = ROUTE.BASE_URL + ROUTE.RESULT;
export const TestService = {
  getTestByUserid: async (id: string) => {
    return await axios.get(`${TEST_ROUTE}${ROUTE.USER}/${id}`);
  },
  getTestDetail: async (id: string) => {
    return await axios.get(`${TEST_ROUTE}/${id}`);
  },
  login: async (data: any) => {
    try {
      return await axios.post(USER_ROUTE + ROUTE.LOGIN, data);
    } catch (err) {
      console.error('error when login: ', err);
    }
  },
  submit: async (data: any, token: string) => {
    return await axios.post(RESULT_ROUTE, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
  },
  updateUser: async (data: any) => {
    await axios.put(USER_ROUTE, data);
  },
};
