import axios from "axios";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";

export const UserService = {
	login: (data) => {
		return axios.post(`${CONST.BASE_URL}${routes.USER}${routes.LOGIN}`, data);
	},
	forgotPassword: (data) => {
		return axios.post(`${CONST.BASE_URL}${routes.USER}${routes.FORGOT_PASSWORD}`, data);
	},
	resetPassword: (data) => {
		return axios.put(`${CONST.BASE_URL}${routes.USER}${routes.RESET_PASSWORD}`, data);
	},
};
