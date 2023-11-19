import axios from "axios";
import { CONST } from "../../utils/const";

const OVERVIEW_ROUTE = CONST.BASE_URL + CONST.ROUTES.COMMON + CONST.ROUTES.OVERVIEW;
export const OverviewService = {
	getFourTopInfo: async () => {
		return await axios.get(`${OVERVIEW_ROUTE}/info`);
	},
	getPieChartInfo: async () => {
		return await axios.get(`${OVERVIEW_ROUTE}/pie`);
	},
	getBarChartInfo: async () => {
		return await axios.get(`${OVERVIEW_ROUTE}/bar`);
	},
};
