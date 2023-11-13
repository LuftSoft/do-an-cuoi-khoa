import axios from "axios";
import { CONST } from "../../utils/const";

const RESULT_ROUTE = CONST.BASE_URL + CONST.ROUTES.RESULT;
const TEST_CREDIT_CLASSES_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST_CREDIT_CLASSES;
const RESULT_CREDIT_CLASSES_ROUTE = CONST.BASE_URL + CONST.ROUTES.RESULT + CONST.ROUTES.TEST_CREDIT_CLASSES;
export const ResultService = {
	getAll: async () => {
		return await axios.get(RESULT_ROUTE);
	},
	getById: async (id) => {
		return await axios.get(`${RESULT_ROUTE}/${id}`);
	},
	getByCreditClassesId: async (id) => {
		return await axios.get(`${RESULT_CREDIT_CLASSES_ROUTE}/${id}`);
	},
};
