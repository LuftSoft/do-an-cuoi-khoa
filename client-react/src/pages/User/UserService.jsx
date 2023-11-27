import axios from "axios";
import { CONST } from "../../utils/const";

const USER_ROUTE = CONST.BASE_URL + CONST.ROUTES.USER;
const GV_ROUTE = USER_ROUTE + "/type/gv";
const SV_ROUTE = USER_ROUTE + "/type/sv";
const COMMON_ROUTE = CONST.BASE_URL + CONST.ROUTES.COMMON;
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
		return await axios.post(`${USER_ROUTE}${CONST.ROUTES.SIGNUP}`, data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	},
	updateUser: async (data, token) => {
		console.log(data);
		return await axios.put(USER_ROUTE, data, { headers: { "Content-Type": "multipart/form-data" } });
	},
	deleteUser: async (id, token) => {
		return await axios.delete(`${USER_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getRoles: async (token) => {
		return await axios.get(`${COMMON_ROUTE}/role`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getPermissionByRole: async (id, token) => {
		return await axios.get(`${COMMON_ROUTE}/role/permission/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getUserByRole: async (id, token) => {
		return await axios.get(`${COMMON_ROUTE}/role/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	deleteUserRole: async (id, token) => {
		return await axios.delete(`${COMMON_ROUTE}/role/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	addUserToRole: async (data, token) => {
		return await axios.post(`${COMMON_ROUTE}/role/user`, data, { headers: { Authorization: `Bearer ${token}` } });
	},
};
