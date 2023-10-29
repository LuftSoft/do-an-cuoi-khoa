import axios from "axios";
import { CONST } from "../../utils/const";

const USER_ROUTE = CONST.BASE_URL + CONST.ROUTES.USER;
const GV_ROUTE = USER_ROUTE + "/type/gv";
const SV_ROUTE = USER_ROUTE + "/type/sv";
export const UserService = {
	getAllUser: async () => {
		return await axios.get(USER_ROUTE);
	},
	getAllSV: async () => {
		return await axios.get(SV_ROUTE);
	},
	getAllGV: async () => {
		return await axios.get(GV_ROUTE);
	},
	getUser: async (id) => {
		return await axios.get(`${USER_ROUTE}/${id}`);
	},
	createUser: async (data, token) => {
		return await axios.post(`${USER_ROUTE}${CONST.ROUTES.SIGNUP}`, data);
	},
	updateUser: async (data, token) => {
		console.log(data);
		return await axios.put(USER_ROUTE, data, { headers: { "Content-Type": "multipart/form-data" } });
	},
	deleteUser: async () => {
		return await axios.post(USER_ROUTE, {});
	},
};
