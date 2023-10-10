import axios from 'axios';
import { SERVER } from '../utils/constant';
import { get } from '../utils/localstorage';

const axiosInstanceNotToken = axios.create({
  baseURL: SERVER, // địa chỉ url của API
});

const axiosToken = axios.create({
  baseURL: SERVER, // địa chỉ url của API
  headers: {
    Authorization: `Bearer ${get('accessToken')}`,
  },
});

export {
  axiosInstanceNotToken,
  axiosToken,
};
