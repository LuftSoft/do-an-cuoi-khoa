import axios from "axios";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";

const TEST_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST;
const TEST_CLASS_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST + CONST.ROUTES.CREDIT_CLASS;
export const TestService = {
	getAllTest: async (token) => {
		return await FeHelpers.axiosWithJwt.GET(TEST_ROUTE, token);
	},
	getOneTest: async (id) => {
		return await axios.get(`${TEST_ROUTE}/${id}`);
	},
	createTest: async (data, token) => {
		return await axios.post(TEST_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	createManualTest: async (data, token) => {
		return await axios.post(`${TEST_ROUTE}/manual`, data, { headers: { Authorization: "Bearer " + token } });
	},
	updateTest: async () => {
		return await axios.post(TEST_ROUTE, {});
	},
	/**
	 * update question of the test.
	 * @param {*} questions
	 * @param {*} testId
	 * @param {*} token
	 * @returns
	 */
	updateTestDetail: async (questions, testId, token) => {
		return await FeHelpers.axiosWithJwt.PUT(`${TEST_ROUTE}/detail`, { questions: questions, id: testId }, token);
	},
	deleteTest: async (id, token) => {
		return await axios.delete(`${TEST_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	// test class service
	getAllTestClass: async () => {
		return await axios.get(`${TEST_CLASS_ROUTE}`);
	},
	getAllTestClassByTestId: async (id, token) => {
		return FeHelpers.axiosWithJwt.GET(`${TEST_CLASS_ROUTE}/${id}`, token);
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
	exportTest: async (id) => {
		return await axios.post(`${TEST_ROUTE}/export/${id}`);
	},
};
