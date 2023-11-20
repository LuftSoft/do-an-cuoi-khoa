import axios from "axios";
import { CONST } from "../../utils/const";

const QUESTION_ROUTE = CONST.BASE_URL + CONST.ROUTES.QUESTION;

export const QuestionService = {
	getAllQuestion: async () => {
		return await axios.get(QUESTION_ROUTE);
	},
	getOneQuestion: async (id) => {
		return await axios.get(`${QUESTION_ROUTE}/${id}`);
	},
	createQuestion: async (data, token) => {
		return await axios.post(QUESTION_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	updateQuestion: async (data, token) => {
		return await axios.put(QUESTION_ROUTE, data, { headers: { Authorization: "Bearer " + token } });
	},
	deleteQuestion: async (id, token) => {
		return await axios.delete(`${QUESTION_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	importQuestion: async (data, token) => {
		return await axios.post(`${QUESTION_ROUTE}/import`, data, {
			headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
		});
	},
	exportQuestion: async (token) => {
		return await axios.post(`${QUESTION_ROUTE}/export`, {
			headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
		});
	},
};
