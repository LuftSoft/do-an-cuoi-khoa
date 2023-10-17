import axios from "axios";
import { CONST } from "../../utils/const";

const SEMESTER_ROUTE = CONST.BASE_URL + CONST.ROUTES.SEMESTER;
export const SemesterService = {
	getAllSemester: async () => {
		return await axios.get(SEMESTER_ROUTE);
	},
	createSemester: async (data) => {
		return await axios.post(SEMESTER_ROUTE, data);
	},
	updateSemester: async () => {
		return await axios.post(SEMESTER_ROUTE, {});
	},
	deleteSemester: async () => {
		return await axios.delete(SEMESTER_ROUTE);
	},
};
