import axios from "axios";
import { CONST } from "../../utils/const";

const CREDIT_CLASS_ROUTE = CONST.BASE_URL + CONST.ROUTES.CREDIT_CLASS;
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
	deleteCreditClass: async () => {
		return await axios.delete(CREDIT_CLASS_ROUTE);
	},
};
