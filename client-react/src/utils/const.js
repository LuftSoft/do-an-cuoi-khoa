const CONST = {
	SIDEBAR: [
		{
			icon: "fa-solid fa-house",
			name: "Tổng quan",
			route: "/overview",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-user",
			name: "Người dùng",
			route: "",
			permissions: [],
			childs: [
				{
					name: "Tài khoản",
					route: "/user",
				},
				{
					name: "Phân quyền",
					route: "/permission",
				},
			],
		},
		{
			icon: "fa-solid fa-book",
			name: "Môn học",
			route: "/subject",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-clipboard-question",
			name: "Câu hỏi",
			route: "/question",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-users",
			name: "Lớp tín chỉ",
			route: "/credit-class",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-calendar-days",
			name: "Lịch kiểm tra",
			route: "/test-schedule",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-file-lines",
			name: "Đề kiểm tra",
			route: "",
			permissions: [],
			childs: [
				{
					name: "Đề kiểm tra",
					route: "/test",
				},
				{
					name: "Kết quả",
					route: "/result",
				},
			],
		},
	],
	BASE_URL: "http://localhost:3000/api/v1",
	ROUTES: {
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
		SUBJECT: "/subject",
		QUESTION: "/question",
		CREDIT_CLASS: "/credit-class",
		TEST_SCHEDULE: "/test-schedule",
		TEST: "/test",
		RESULT: "/result",
		CHAPTER: "/chapter",
	},
};

export { CONST };
