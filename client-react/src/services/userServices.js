import { logoutSuccess } from "../redux/authSlice";
import { updateUser } from "../redux/userSlice";
import { axiosJWT, url } from "../utils/httpRequest";

export const signUp = () => {};

export const getUser = async (accessToken, refreshToken, dispatch) => {
	if (refreshToken) {
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		try {
			const res = await axiosJwt.get(url.getUser, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			let isBlock = Boolean(res.data.userDto.isBlock);
			if (res.data.userDto.roles.includes("admin")) {
				if (!isBlock) {
					dispatch(updateUser(res.data.userDto));
					return {
						isSuccess: true,
						isBlock: false,
						data: res.data,
					};
				} else {
					return {
						isSuccess: false,
						isBlock: true,
						data: null,
					};
				}
			} else {
				return {
					isSuccess: false,
					isBlock: false,
					data: null,
				};
			}
		} catch (error) {
			console.log(error);
			return {
				isSuccess: false,
				data: error.response.data,
			};
		}
	}
};

export const logout = (dispatch) => {
	dispatch(logoutSuccess());
	dispatch(updateUser(null));
};
