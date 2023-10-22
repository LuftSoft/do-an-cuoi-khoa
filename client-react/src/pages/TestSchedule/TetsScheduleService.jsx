import axios from "axios";
import { CONST } from "../../utils/const";

const TEST_SCHEDULE_ROUTE = CONST.BASE_URL + CONST.ROUTES.TEST_SCHEDULE;

export const TestScheduleService = {
	getAllTestSchedule: async () => {
		return await axios.get(TEST_SCHEDULE_ROUTE);
	},
	createTestSchedule: async (data) => {
		return await axios.post(TEST_SCHEDULE_ROUTE, data);
	},
	updateTestSchedule: async () => {
		return await axios.post(TEST_SCHEDULE_ROUTE, {});
	},
	deleteTestSchedule: async (id) => {
		return await axios.delete(`${TEST_SCHEDULE_ROUTE}/${id}`);
	},
};
