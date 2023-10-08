import NonLayout from "../layouts/NonLayout";

import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import HotelPage from "../pages/HotelPage";
import CreateHotelPage from "../pages/CreateHotelPage";
import RoomPage from "../pages/RoomPage";
import CreateRoomPage from "../pages/CreateRoomPage";
import BookingRoomPage from "../pages/BookingRoomPage";
import UpdateHotelPage from "../pages/UpdateHotelPage";
import UpdateRoomPage from "../pages/UpdateRoomPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

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
};

export const publicRoutes = [
	{ path: routes.signIn, page: SignInPage, layout: NonLayout },
	{ path: routes.signUp, page: SignUpPage, layout: NonLayout },
	{ path: routes.forgotPassword, page: ForgotPasswordPage, layout: NonLayout },
	{ path: routes.resetPassword, page: ResetPasswordPage, layout: NonLayout },
];

export const privateRoutes = [
	{ path: routes.hotel, page: HotelPage, layout: null },
	{ path: routes.createHotel, page: CreateHotelPage, layout: null },
	{ path: routes.updateHotel, page: UpdateHotelPage, layout: null },
	{ path: routes.room, page: RoomPage, layout: null },
	{ path: routes.createRoom, page: CreateRoomPage, layout: null },
	{ path: routes.updateRoom, page: UpdateRoomPage, layout: null },
	{ path: routes.booking, page: BookingRoomPage, layout: null },
];
