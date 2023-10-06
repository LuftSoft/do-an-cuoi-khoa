export const BASE_ROUTE = process.env.NEXT_PUBLIC_DOMAIN_URL;
export const API_BASE_ROUTE = `${BASE_ROUTE}api/`;

export const SUBJECTS_ROUTE = `${BASE_ROUTE}subjects`;
export const QUESTIONS_ROUTE = `${BASE_ROUTE}questions`;
export const TESTS_ROUTE = `${BASE_ROUTE}tests`;
export const MOCK_TEST_ROUTE = `${BASE_ROUTE}mock-test`;
export const NOT_FOUND_ROUTE = `${BASE_ROUTE}404`;

export const LOGIN_ROUTE = `${BASE_ROUTE}login`;
export const FORGOT_PASSWORD_ROUTE = `${BASE_ROUTE}forgot-password`;
export const RESET_PASSWORD_ROUTE = `${BASE_ROUTE}reset-password`;

export const API_SUBJECTS_ROUTE = `${API_BASE_ROUTE}subjects`;
export const API_QUESTIONS_ROUTE = `${API_BASE_ROUTE}questions`;
export const API_TESTS_ROUTE = `${API_BASE_ROUTE}tests`;
export const API_PROFILE_ROUTE = `${API_BASE_ROUTE}profile`;
export const FORGOT_PASSWORD_API_ROUTE = `${API_BASE_ROUTE}profile/forgot-password`;
export const RESET_PASSWORD_API_ROUTE = `${API_BASE_ROUTE}profile/reset-password`;
