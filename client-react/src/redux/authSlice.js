import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
	},
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		logoutSuccess: (state) => {
			state.isAuthenticated = false;
			state.accessToken = null;
			state.refreshToken = null;
		},
	},
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
