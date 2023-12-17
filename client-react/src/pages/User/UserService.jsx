import axios from "axios";
import { CONST } from "../../utils/const";
import { axiosJWT } from "../../utils/httpRequest";
import { FeHelpers } from "../../utils/helpers";

const USER_ROUTE = CONST.BASE_URL + CONST.ROUTES.USER;
const USER_FILTER_ROUTE = CONST.BASE_URL + CONST.ROUTES.USER + CONST.ROUTES.FILTER;
const GV_ROUTE = USER_ROUTE + "/type/gv";
const SV_ROUTE = USER_ROUTE + "/type/sv";
const COMMON_ROUTE = CONST.BASE_URL + CONST.ROUTES.COMMON;
const ALL = "ALL";
export const UserService = {
	getAllUser: async () => {
		return await axios.get(USER_ROUTE);
	},
	getAllUserFilter: async (filterData) => {
		let url = USER_FILTER_ROUTE;
		var isFirstParam = false;
		for (let i of Object.keys(filterData)) {
			if (!isFirstParam && filterData[i] !== ALL) {
				url += `?${i}=${filterData[i]}`;
				isFirstParam = !isFirstParam;
			} else if (filterData[i] !== ALL) {
				url += `&${i}=${filterData[i]}`;
			}
		}
		return await axios.get(url);
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
	changePassword: async (data, token) => {
		return await FeHelpers.axiosWithJwt.PUT(`${USER_ROUTE}/password`, data, token);
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
	getAllCluster: async (token) => {
		return await axios.get(`${COMMON_ROUTE}/cluster`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getAllSubjectByUserCluster: async (token) => {
		return await axios.get(`${COMMON_ROUTE}/cluster/subject/:id`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getUserClusterSubjectByUserId: async (id, token) => {
		return await axios.get(`${COMMON_ROUTE}/user-cluster-subject/user/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},
	deleteUserClusterSubject: async (id, token) => {
		return await axios.delete(`${COMMON_ROUTE}/user-cluster-subject/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},
	getUCSUser: async (id) => {
		return await axios.get(`${COMMON_ROUTE}/user-cluster-subject/user`);
	},
	getUCSSubjectByUserId: async (id) => {
		return await axios.get(`${COMMON_ROUTE}/user-cluster-subject/subject/user/${id}`);
	},
	getUCSUserDetail: async (id) => {
		return await axios.get(`${COMMON_ROUTE}/user-cluster-subject/user/${id}`);
	},
	createUserClusterSubject: async (data, token) => {
		return await axios.post(`${COMMON_ROUTE}/user-cluster-subject`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},
	import: async (data, token) => {
		return await axios.post(`${USER_ROUTE}/import`, data, {
			headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
		});
	},
};
