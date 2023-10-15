import axios from "axios";
import { CONST } from "../../utils/const";

const QUESTION_ROUTE = CONST.BASE_URL + CONST.ROUTES.QUESTION;

export const QuestionService = {
	getAllQuestion: async () => {
		return await axios.get(QUESTION_ROUTE);
	},
	createQuestion: async (data) => {
		return await axios.post(QUESTION_ROUTE, data);
	},
	updateQuestion: async () => {
		return await axios.post(QUESTION_ROUTE, {});
	},
	deleteQuestion: async () => {
		return await axios.delete(QUESTION_ROUTE);
	},
};
