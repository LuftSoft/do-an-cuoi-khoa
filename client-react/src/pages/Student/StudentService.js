import axios from "axios";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";
const TEST_ROUTE = CONST.BASE_URL;
const RESULT_ROUTE = CONST.BASE_URL;
export const StudentService = {
	getTestByUser: async (id, token) => {
		return await axios.get(`${TEST_ROUTE}${routes.USER}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getTestDetailByUser: async (id, token) => {
		return await axios.get(`${TEST_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getResultByUser: async (id, token) => {
		return await axios.get(`${RESULT_ROUTE}${routes.USER}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getResultDetailByUser: async (id, token) => {
		return await axios.get(`${RESULT_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	submitTest: async (data, token) => {
		return await axios.post(RESULT_ROUTE, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},
};
