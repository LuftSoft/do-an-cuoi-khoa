import axios from 'axios';
import {ROUTE} from '../../routes/route.constant';

const USER_ROUTE = ROUTE.BASE_URL + ROUTE.USER;
const TEST_ROUTE = ROUTE.BASE_URL + ROUTE.TEST;
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
  signup: async (data: any) => {
    await axios.post(USER_ROUTE + ROUTE.SIGNUP, data);
  },
  updateUser: async (data: any) => {
    await axios.put(USER_ROUTE, data);
  },
};
