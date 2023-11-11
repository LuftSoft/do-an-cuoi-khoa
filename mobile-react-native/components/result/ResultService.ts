import axios from 'axios';
import { ROUTE } from '../../routes/route.constant';

const USER_ROUTE = ROUTE.BASE_URL + ROUTE.USER;
const TEST_ROUTE = ROUTE.BASE_URL + ROUTE.TEST;
const RESULT_ROUTE = ROUTE.BASE_URL + ROUTE.RESULT;
export const ResultService = {
    getResultByUserid: async (id: string) => {
        return await axios.get(`${RESULT_ROUTE}${ROUTE.USER}/${id}`);
    },
}