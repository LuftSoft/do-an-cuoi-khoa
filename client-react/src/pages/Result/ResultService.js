import axios from "axios";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";

const RESULT_ROUTE = CONST.BASE_URL + CONST.ROUTES.RESULT;
const TEST_CREDIT_CLASSES_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST_CREDIT_CLASSES;
const RESULT_CREDIT_CLASSES_ROUTE = CONST.BASE_URL + CONST.ROUTES.RESULT + CONST.ROUTES.TEST_CREDIT_CLASSES;
export const ResultService = {
	getAll: async (token) => {
		return FeHelpers.axiosWithJwt.GET(RESULT_ROUTE, token);
	},
	/**
	 *
	 * @param {subject_id:'',year:'',semester:''} filterData
	 * @returns
	 */
	filterResult: async (filterData, token) => {
		return FeHelpers.axiosWithJwt.GET(
			`${RESULT_ROUTE}/filter?subject_id=${filterData.subject_id}&year=${filterData.year}&semester=${filterData.semester}`,
			token,
		);
	},
	getById: async (id) => {
		return await axios.get(`${RESULT_ROUTE}/${id}`);
	},
	getByCreditClassesId: async (id) => {
		return await axios.get(`${RESULT_CREDIT_CLASSES_ROUTE}/${id}`);
	},
	exportTranscript: async (id) => {
		return await axios.post(`${RESULT_ROUTE}/export/${id}`);
	},
	getAllSemesterYear: async () => {
		return await axios.get(`${CONST.BASE_URL}/semester/year`);
	},
	getAllSemesters: async () => {
		return await axios.get(`${CONST.BASE_URL}/semester/semester`);
	},
};
