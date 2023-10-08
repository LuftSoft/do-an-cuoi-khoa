import axios from "axios";
import jwtDecode from "jwt-decode";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	CORE_URL: import.meta.env.CORE_URL
});

/**
 * this is url object which contains endpoint
 */
export const url = {
	signIn: "user/login",
	signUp: "user/signup",
	getUser: "user/detail",
	hotel: "hotel/user",
	province: "location/provine",
	district: "location/district/",
	homelet: "location/homelet/",
	createHotel: "hotel",
	refreshToken: "user/refresh-token",
	createRoom: "room",
	bookingList: "booking/hotel/",
	deleteHotel: "hotel/",
	room: "hotel/",
	deleteRoom: "room/",
	detailHotel: "hotel/",
	updateHotel: "hotel",
	detailRoom: "room/",
	updateRoom: "room",
	updateGalleries: "room/gallery",
	deleteGalleries: "room/gallery",
	forgotPassword: "user/fogot-password",
	resetPassword: "user/reset-password",
	categories: "category",
	getBookedUserInfo: "user/",
};

/**
 * to get new accessToken and refreshToken
 * @param {String} refreshToken
 * @returns {Object} new Object contains new accessToken and refreshToken
 */
const getNewAccessToken = async (refreshToken) => {
	if (!refreshToken) {
		throw new Error("refreshToken is not found in refreshToken function");
	}
	try {
		const res = await axiosInstance.get(url.refreshToken, {
			headers: {
				Authorization: refreshToken,
			},
		});
		return res.data;
	} catch (error) {
		console.log("refreshToken", error);
	}
};

export const axiosJWT = (accessToken, refreshToken, dispatch) => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_BASE_URL,
	});
	instance.interceptors.request.use(
		async (config) => {
			const date = new Date();
			// check refresh token exp first, then check accesToken
			const decodedRefresh = jwtDecode(refreshToken);
			if (decodedRefresh.exp < date.getTime() / 1000) {
				// set token null then show login, and then redirect path before
			}
			const decodedToken = jwtDecode(accessToken);
			if (decodedToken.exp < date.getTime() / 1000) {
				const data = await getNewAccessToken(refreshToken);
				if (data.isSuccess) {
					dispatch(loginSuccess(data));
					config.headers["Authorization"] = `Bearer ${data.accessToken}`;
				}
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);
	return instance;
};

export const axiosGet = async (url, config = {}, instance = axiosInstance) => {
	const response = await instance.get(url, config);
	return response.data;
};

export const axiosPost = async (url, data = {}, config = {}, instance = axiosInstance) => {
	const response = await instance.post(url, data, config);
	return response.data;
};

export const axiosDelete = async (url, config = {}, instance = axiosInstance) => {
	const response = await instance.delete(url, config);
	return response.data;
};

export const axiosPatch = async (url, data = {}, config = {}, instance = axiosInstance) => {
	const response = await instance.patch(url, data, config);
	return response.data;
};
