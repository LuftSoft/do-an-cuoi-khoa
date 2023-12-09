import axios from "axios";
import { CONST } from "../../utils/const";

const CREDIT_CLASS_ROUTE = CONST.BASE_URL + CONST.ROUTES.CREDIT_CLASS;
const ASSIGN_ROUTE = CONST.BASE_URL + CONST.ROUTES.ASSIGN;
export const CreditClassService = {
	getAllCreditClass: async () => {
		return await axios.get(CREDIT_CLASS_ROUTE);
	},
	createCreditClass: async (data) => {
		return await axios.post(CREDIT_CLASS_ROUTE, data);
	},
	updateCreditClass: async () => {
		return await axios.post(CREDIT_CLASS_ROUTE, {});
	},
	deleteCreditClass: async (id) => {
		return await axios.delete(`${CREDIT_CLASS_ROUTE}/${id}`);
	},
	createUserClassDetail: async (data, token) => {
		return await axios.post(`${CREDIT_CLASS_ROUTE}/user`, data);
	},
	createListUserClassDetail: async (data, token) => {
		return await axios.post(`${CREDIT_CLASS_ROUTE}/user/list`, data);
	},
	getCreditClassDetail: async (id) => {
		return await axios.get(`${CREDIT_CLASS_ROUTE}/user/${id}`);
	},
	assignClass: async (data) => {
		return await axios.post(ASSIGN_ROUTE, data);
	},
	getAssignClass: async (id) => {
		return await axios.get(`${CREDIT_CLASS_ROUTE}/assign/${id}`);
	},
	removeUserAssign: async (id) => {
		return await axios.delete(`${ASSIGN_ROUTE}/${id}`);
	},
	removeUserClass: async (id) => {
		return await axios.delete(`${CREDIT_CLASS_ROUTE}/user/${id}`);
	},
	importUserClass: async (data, id, token) => {
		return await axios.post(
			`${CREDIT_CLASS_ROUTE}/user/import`,
			{ ...data, id: id },
			{
				headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
			},
		);
	},
};
