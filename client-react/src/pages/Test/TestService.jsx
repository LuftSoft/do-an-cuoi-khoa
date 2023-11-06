import axios from "axios";
import { CONST } from "../../utils/const";

const TEST_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST;
const TEST_CLASS_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST + CONST.ROUTES.CREDIT_CLASS;
export const TestService = {
	getAllTest: async () => {
		return await axios.get(TEST_ROUTE);
	},
	getOneTest: async (id) => {
		return await axios.get(`${TEST_ROUTE}/${id}`);
	},
	createTest: async (data, token) => {
		return await axios.post(TEST_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	updateTest: async () => {
		return await axios.post(TEST_ROUTE, {});
	},
	deleteTest: async () => {
		return await axios.post(TEST_ROUTE, {});
	},
	// test class service
	getAllTestClass: async () => {
		return await axios.get(`${TEST_CLASS_ROUTE}`);
	},
	getAllTestClassByTestId: async (id) => {
		return await axios.get(`${TEST_CLASS_ROUTE}/${id}`);
	},
	createTestClass: async (data, token) => {
		return await axios.post(TEST_CLASS_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	updateTestClass: async (data, token) => {
		return await axios.put(TEST_CLASS_ROUTE, {});
	},
	deleteTestClass: async (id) => {
		return await axios.delete(`${TEST_CLASS_ROUTE}/${id}`);
	},
};
