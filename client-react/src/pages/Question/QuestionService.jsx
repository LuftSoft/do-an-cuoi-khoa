import axios from "axios";
import { CONST } from "../../utils/const";

const QUESTION_ROUTE = CONST.BASE_URL + CONST.ROUTES.QUESTION;

export const QuestionService = {
	getAllQuestion: async () => {
		return await axios.get(QUESTION_ROUTE);
	},
	createQuestion: async (data, token) => {
		return await axios.post(QUESTION_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	updateQuestion: async () => {
		return await axios.post(QUESTION_ROUTE, {});
	},
	deleteQuestion: async (id, token) => {
		return await axios.delete(`${QUESTION_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
};
