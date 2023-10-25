import axios from "axios";
import { CONST } from "../../utils/const";

const TEST_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST;
export const TestService = {
	getAllTest: async () => {
		return await axios.get(TEST_ROUTE);
	},
	createTest: async (data) => {
		return await axios.post(TEST_ROUTE, data);
	},
	updateTest: async () => {
		return await axios.post(TEST_ROUTE, {});
	},
	deleteTest: async () => {
		return await axios.post(TEST_ROUTE, {});
	},
};
