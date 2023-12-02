import NonLayout from "../layouts/NonLayout";

import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import SignInPage from "../pages/Auth/SignInPage";
import CreditClassLayoutComponent from "../pages/CreditClass/CreditClassLayoutComponent";
import OverviewComponent from "../pages/Overview/OverviewComponent";
import QuestionComponent from "../pages/Question/QuestionComponent";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ResultLayoutComponent from "../pages/Result/ResultLayoutComponent";
import { StudentResultComponent, StudentTestComponent } from "../pages/Student";
import { SubjectLayoutComponent } from "../pages/Subject";
import TestComponent from "../pages/Test/TestComponent";
import TestTakeComponent from "../pages/Test/TestTakeComponent";
import TestScheduleComponent from "../pages/TestSchedule/TestScheduleComponent";
import UserSettingComponent from "../pages/User/UserSettingComponent";
import UserLayoutComponent from "../pages/User/UserLayoutComponent";
import AssignUserRoleComponent from "../pages/User/AssignUserRoleComponent";
import { CONST } from "../utils/const";

export const routes = {
	SIGNIN: "/sign-in",
	signUp: "/sign-up",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",

	hotel: "/hotel",
	createHotel: "/hotel/create",
	updateHotel: "/hotel/:hotelId",
	room: "/hotel/:hotelId/room",
	createRoom: "/hotel/:hotelId/room/create",
	updateRoom: "/hotel/:hotelId/room/:roomId",
	booking: "/hotel/:hotelId/booking",
	//new project
	OVERVIEW: "/overview",
	USER: "/user",
	PERMISSION: "/permission",
	SUBJECT: "/subject",
	QUESTION: "/question",
	CREDIT_CLASS: "/credit-class",
	TEST_SCHEDULE: "/test-schedule",
	TEST: "/test",
	RESULT: "/result",
	LOGIN: "/login",
	UNAUTHORIZE: "/unauthorize",
	SETTING: "/setting",
	STUDENT: "/student",
};

export const publicRoutes = [
	{ path: routes.SIGNIN, page: SignInPage, layout: NonLayout, permissions: [] },
	{ path: routes.FORGOT_PASSWORD, page: ForgotPasswordPage, layout: NonLayout, permissions: [] },
	{ path: routes.RESET_PASSWORD, page: ResetPasswordPage, layout: NonLayout, permissions: [] },
];

export const privateRoutes = [
	{ path: routes.OVERVIEW, page: OverviewComponent, layout: null, permissions: [CONST.PERMISSION.ADMIN] },
	{ path: routes.SUBJECT, page: SubjectLayoutComponent, layout: null, permissions: [] },
	{ path: routes.USER, page: UserLayoutComponent, layout: null, permissions: [CONST.PERMISSION.ADMIN] },
	{ path: routes.SETTING, page: UserSettingComponent, layout: null, permissions: [] },
	{ path: routes.PERMISSION, page: AssignUserRoleComponent, layout: null, permissions: [] },
	{ path: routes.QUESTION, page: QuestionComponent, layout: null, permissions: [] },
	{ path: routes.CREDIT_CLASS, page: CreditClassLayoutComponent, layout: null, permissions: [] },
	{ path: routes.TEST_SCHEDULE, page: TestScheduleComponent, layout: null, permissions: [] },
	{ path: routes.RESULT, page: ResultLayoutComponent, layout: null, permissions: [] },
	{ path: routes.TEST, page: TestComponent, layout: null, permissions: [] },
	{ path: routes.TEST + "/test", page: TestTakeComponent, layout: null, permissions: [] },
	{ path: routes.STUDENT + routes.TEST, page: StudentTestComponent, layout: null, permissions: [] },
	{ path: routes.STUDENT + routes.RESULT, page: StudentResultComponent, layout: null, permissions: [] },
];
