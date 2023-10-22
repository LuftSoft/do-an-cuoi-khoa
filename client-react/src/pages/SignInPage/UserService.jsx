import axios from "axios";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";

export const UserService = {
	login: (data) => {
		return axios.post(`${CONST.BASE_URL}${routes.USER}${routes.LOGIN}`, data);
	},
};
