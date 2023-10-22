import NonLayout from "../layouts/NonLayout";

import BookingRoomPage from "../pages/BookingRoomPage";
import CreateHotelPage from "../pages/CreateHotelPage";
import CreateRoomPage from "../pages/CreateRoomPage";
import CreditClassComponent from "../pages/CreditClass/CreditClassComponent";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import HotelPage from "../pages/HotelPage";
import OverviewComponent from "../pages/Overview/OverviewComponent";
import { default as QuestionComponent, default as UserComponent } from "../pages/Question/QuestionComponent";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ResultComponent from "../pages/Result/ResultComponent";
import RoomPage from "../pages/RoomPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { SubjectLayoutComponent } from "../pages/Subject";
import CreateSubjectComponent from "../pages/Subject/CreateSubjectComponent";
import TableComTest from "../pages/TableComTest";
import TestComponent from "../pages/Test/TestComponent";
import TestScheduleComponent from "../pages/TestSchedule/TestScheduleComponent";
import UpdateHotelPage from "../pages/UpdateHotelPage";
import UpdateRoomPage from "../pages/UpdateRoomPage";

export const routes = {
	signIn: "/sign-in",
	signUp: "/sign-up",
	forgotPassword: "/forgot-password",
	resetPassword: "/reset-password",

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
};

export const publicRoutes = [
	{ path: routes.hotel, page: HotelPage, layout: null, permissions: [] },
	{ path: "/subject/create-subject", page: CreateSubjectComponent, layout: null, permissions: [] },
	{ path: routes.signIn, page: SignInPage, layout: NonLayout, permissions: [] },
	{ path: routes.signUp, page: SignUpPage, layout: NonLayout, permissions: [] },
	{ path: routes.forgotPassword, page: ForgotPasswordPage, layout: NonLayout, permissions: [] },
	{ path: routes.resetPassword, page: ResetPasswordPage, layout: NonLayout, permissions: [] },
	{ path: routes.createHotel, page: CreateHotelPage, layout: null, permissions: [] },
	{ path: routes.updateHotel, page: UpdateHotelPage, layout: null, permissions: [] },
	{ path: routes.room, page: RoomPage, layout: null, permissions: [] },
	{ path: routes.createRoom, page: CreateRoomPage, layout: null, permissions: [] },
	{ path: routes.updateRoom, page: UpdateRoomPage, layout: null, permissions: [] },
	{ path: routes.booking, page: BookingRoomPage, layout: null, permissions: [] },
	{ path: routes.UNAUTHORIZE, page: BookingRoomPage, layout: null, permissions: [] },
];

export const privateRoutes = [
	{ path: routes.OVERVIEW, page: OverviewComponent, layout: null, permissions: [] },
	{ path: routes.SUBJECT, page: SubjectLayoutComponent, layout: null, permissions: [] },
	{ path: routes.USER, page: UserComponent, layout: null, permissions: [] },
	{ path: routes.PERMISSION, page: UserComponent, layout: null, permissions: [] },
	{ path: routes.QUESTION, page: QuestionComponent, layout: null, permissions: [] },
	{ path: routes.CREDIT_CLASS, page: CreditClassComponent, layout: null, permissions: [] },
	{ path: routes.TEST_SCHEDULE, page: TestScheduleComponent, layout: null, permissions: [] },
	{ path: routes.RESULT, page: ResultComponent, layout: null, permissions: [] },
	{ path: routes.TEST, page: TestComponent, layout: null, permissions: [] },
];
