import axios from "axios";
import { CONST } from "../../utils/const";

const RESULT_ROUTE = CONST.BASE_URL + CONST.ROUTES.RESULT;
export const ResultService = {
	getAll: async () => {
		return await axios.get(RESULT_ROUTE);
	},
};
