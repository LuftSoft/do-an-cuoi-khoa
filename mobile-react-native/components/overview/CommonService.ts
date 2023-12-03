import axios from 'axios';
import { ROUTE } from '../../routes/route.constant';

const COMMON_ROUTE = ROUTE.BASE_URL + '/common';
export const CommonService = {
  getUserInfo: async (id: string) => {
    return axios.get(`${COMMON_ROUTE}/overview/user/info/${id}`)
  }
};
