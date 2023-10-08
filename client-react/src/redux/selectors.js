export const selectAccessToken = (state) => state.auth.accessToken;

export const selectRefreshToken = (state) => state.auth.refreshToken;

export const selectUser = (state) => state.user.currentUser;
