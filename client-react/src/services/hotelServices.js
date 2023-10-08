import { axiosGet, url } from "../utils/httpRequest";

export const getDetailHotel = async (hotelId) => {
	try {
		const hotelRes = await axiosGet(url.detailHotel + hotelId);
		let districtRes;
		try {
			districtRes = await axiosGet(url.district + hotelRes.hotelDto.provineId);
		} catch (error) {
			return Promise.reject(error);
		}
		let homeletRes;
		try {
			homeletRes = await axiosGet(url.homelet + hotelRes.hotelDto.districtId);
		} catch (error) {
			return Promise.reject(error);
		}
		return {
			...hotelRes,
			hotelDto: {
				...hotelRes.hotelDto,
				districts: districtRes.data,
				homelets: homeletRes.data,
			},
		};
	} catch (error) {
		return Promise.reject(error);
	}
};
