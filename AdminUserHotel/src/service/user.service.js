import { getUserUrl } from '../utils/constant/pointApi';
import { axiosToken } from './axios.service';

const getDataUserAPI = () => axiosToken.get(getUserUrl);
const patchLockUserAPI = () => axiosToken.patch(getUserUrl);
const blockUserAPI = (id) => axiosToken.patch(`/user/block/${id}`);
const unblockUserAPI = (id) => axiosToken.patch(`/user/unlock/${id}`);

export {
  getDataUserAPI,
  patchLockUserAPI,
  blockUserAPI,
  unblockUserAPI,
};
