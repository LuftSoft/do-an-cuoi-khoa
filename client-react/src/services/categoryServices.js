import { axiosGet, url } from "../utils/httpRequest";

export const getCategories = async () => {
	try {
		const res = await axiosGet(url.categories);
		return res;
	} catch (error) {
		return Promise.reject(error);
	}
};
