import axios from "axios";
import { CONST } from "../../utils/const";

const SUBJECT_ROUTE = CONST.BASE_URL + CONST.ROUTES.SUBJECT;
const CHAPTER_ROUTE = CONST.BASE_URL + CONST.ROUTES.CHAPTER;
export const SubjectService = {
	getAllSubject: async () => {
		return await axios.get(SUBJECT_ROUTE);
	},
	createSubject: async (data) => {
		return await axios.post(SUBJECT_ROUTE, data);
	},
	updateSubject: async () => {
		return await axios.post(SUBJECT_ROUTE, {});
	},
	deleteSubject: async () => {
		return await axios.post(SUBJECT_ROUTE, {});
	},
	//chapter
	getAllChapter: async () => {
		return await axios.get(CHAPTER_ROUTE, {});
	},
	getOneChapter: async () => {
		return await axios.get(CHAPTER_ROUTE, {});
	},
	getChapterBySubjectId: async (id) => {
		return await axios.get(CHAPTER_ROUTE + CONST.ROUTES.SUBJECT + `/${id}`, {});
	},
	createChapter: async (data) => {
		return await axios.post(CHAPTER_ROUTE, data);
	},
	updateChapter: async () => {
		return await axios.post(CHAPTER_ROUTE, {});
	},
	deleteSubject: async () => {
		return await axios.post(CHAPTER_ROUTE, {});
	},
};
