import axios from "axios";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";

const SUBJECT_ROUTE = CONST.BASE_URL + CONST.ROUTES.SUBJECT;
const CHAPTER_ROUTE = CONST.BASE_URL + CONST.ROUTES.CHAPTER;
const DEPARTMENT_ROUTE = CONST.BASE_URL + CONST.ROUTES.DEPARTMENT;
export const SubjectService = {
	getAllSubject: async () => {
		return await axios.get(SUBJECT_ROUTE);
	},
	getSubjectByUserId: async (token) => {
		return await FeHelpers.axiosWithJwt.GET(SUBJECT_ROUTE + "/user", token);
	},
	getSubjectDropdownByUserId: async (token) => {
		return await FeHelpers.axiosWithJwt.GET(SUBJECT_ROUTE + "/user/dropdown", token);
	},
	getOneSubject: async (id) => {
		return await axios.get(`${SUBJECT_ROUTE}/${id}`);
	},
	createSubject: async (data) => {
		return await axios.post(SUBJECT_ROUTE, data);
	},
	updateSubject: async (payload) => {
		return await axios.put(SUBJECT_ROUTE, payload, {});
	},
	deleteSubject: async (id, token) => {
		return await axios.delete(`${SUBJECT_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	//chapter
	getAllChapter: async (token) => {
		return await FeHelpers.axiosWithJwt.GET(CHAPTER_ROUTE, token);
	},
	getOneChapter: async (id) => {
		return await axios.get(`${CHAPTER_ROUTE}/${id}`, {});
	},
	getChapterBySubjectId: async (id) => {
		return await axios.get(CHAPTER_ROUTE + CONST.ROUTES.SUBJECT + `/${id}`, {});
	},
	createChapter: async (data) => {
		return await axios.post(CHAPTER_ROUTE, data);
	},
	updateChapter: async (data) => {
		return await axios.put(CHAPTER_ROUTE, data);
	},
	deleteChapter: async (id, token) => {
		return await axios.delete(`${CHAPTER_ROUTE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
	},
	getAllDepartment: async () => {
		return await axios.get(DEPARTMENT_ROUTE);
	},
};
