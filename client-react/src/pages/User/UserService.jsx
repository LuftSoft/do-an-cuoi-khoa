import axios from "axios";
import { CONST } from "../../utils/const";

const USER_ROUTE = CONST.BASE_URL + CONST.ROUTES.USER;
export const UserService = {
	getAllUser: async () => {
		return await axios.get(USER_ROUTE);
	},
	createUser: async (data) => {
		return await axios.post(USER_ROUTE, data);
	},
	updateUser: async () => {
		return await axios.post(USER_ROUTE, {});
	},
	deleteUser: async () => {
		return await axios.post(USER_ROUTE, {});
	},
};
