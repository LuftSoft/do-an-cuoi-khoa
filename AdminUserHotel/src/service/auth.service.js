import { getDataUser, loginUrl } from '../utils/constant/pointApi';
import { get } from '../utils/localstorage';
import { axiosInstanceNotToken, axiosToken } from './axios.service';

const loginAPI = (payload) => {
  const { username, password } = payload;
  return axiosInstanceNotToken.post(loginUrl, {
    userName: username, password,
  });
};

const getDataUserAPI = (accessToken) => axiosInstanceNotToken.get(getDataUser, {
  headers: {
    Authorization: `Bearer ${get('accessToken') || accessToken}`,
  },
});

export {
  loginAPI,
  getDataUserAPI,
};
