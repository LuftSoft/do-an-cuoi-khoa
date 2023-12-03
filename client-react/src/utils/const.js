const PERMISSION = {
	ADMIN: "admin",
	GV: "gv",
	SV: "sv",
};
const CONST = {
	BUTTON: {
		COLOR: {
			INFO: "info",
			SUCCESS: "success",
			WARNING: "warning",
			PRIMARY: "primary",
			SECONDARY: "secondary",
			ERROR: "error",
		},
	},
	DIALOG: {
		TYPE: {
			CREATE: "create",
			ADD: "add",
			EDIT: "edit",
			DELETE: "delete",
			VIEW: "view",
		},
	},
	API_RESPONSE: {
		SUCCESS: "SUCCESS",
		ERROR: "ERROR",
	},
	QUESTION: {
		LEVEL: ["EASY", "MEDIUM", "DIFFICULT"],
		LEVEL_OBJ: { Dễ: "EASY", Vừa: "MEDIUM", Khó: "DIFFICULT" },
		CORRECT_ANSWER: ["answer_a", "answer_b", "answer_c", "answer_d"],
		CORRECT_ANSWER_OBJ: [
			{ "Đáp án A": "answer_a" },
			{ "Đáp án B": "answer_b" },
			{ "Đáp án C": "answer_c" },
			{ "Đáp án D": "answer_d" },
		],
		IMPORT_FILE_TEMPLATE: "http://localhost:5173/public/file/question_import_template.xlsx",
	},
	USER: {
		GENDER: {
			MALE: "MALE",
			FEMALE: "FEMALE",
		},
		TYPE: {
			SV: "SV",
			GV: "GV",
		},
	},
	SIDEBAR: [
		{
			icon: "fa-solid fa-house",
			name: "Tổng quan",
			route: "/overview",
			permissions: [PERMISSION.ADMIN],
			childs: [],
		},
		{
			icon: "fa-solid fa-user",
			name: "Người dùng",
			route: "",
			permissions: [PERMISSION.ADMIN],
			childs: [
				{
					name: "Tài khoản",
					route: "/user",
					permissions: [PERMISSION.ADMIN],
				},
				{
					name: "Phân quyền",
					route: "/permission",
					permissions: [PERMISSION.ADMIN],
				},
			],
		},
		{
			icon: "fa-solid fa-book",
			name: "Môn học",
			route: "/subject",
			permissions: [PERMISSION.GV],
			childs: [],
		},
		{
			icon: "fa-solid fa-clipboard-question",
			name: "Câu hỏi",
			route: "/question",
			permissions: [PERMISSION.GV],
			childs: [],
		},
		{
			icon: "fa-solid fa-users",
			name: "Lớp tín chỉ",
			route: "/credit-class",
			permissions: [PERMISSION.GV],
			childs: [],
		},
		{
			icon: "fa-solid fa-calendar-days",
			name: "Lịch kiểm tra",
			route: "/test-schedule",
			permissions: [PERMISSION.GV, PERMISSION.ADMIN],
			childs: [],
		},
		{
			icon: "fa-solid fa-file-lines",
			name: "Đề kiểm tra",
			route: "",
			permissions: [PERMISSION.GV],
			childs: [
				{
					name: "Đề kiểm tra",
					route: "/test",
					permissions: [PERMISSION.GV],
				},
				{
					name: "Kết quả",
					route: "/result",
					permissions: [PERMISSION.GV],
				},
			],
		},
		{
			icon: "fa-solid fa-font",
			name: "Bài thi của bạn",
			route: "/student/test",
			permissions: [PERMISSION.SV],
			childs: [],
		},
		{
			icon: "fa-solid fa-bullseye",
			name: "Kết quả thi",
			route: "/student/result",
			permissions: [PERMISSION.SV],
			childs: [],
		},
	],
	SELF_URL: "http://localhost:5173",
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
		TEST_CREDIT_CLASSES: "/test-credit-classes",
		TEST_SCHEDULE: "/test-schedule",
		TEST: "/test",
		RESULT: "/result",
		CHAPTER: "/chapter",
		SEMESTER: "/semester",
		SIGNUP: "/signup",
		ASSIGN: "/assign",
		COMMON: "/common",
		DEPARTMENT: "/department",
	},
	PERMISSION: {
		ADMIN: "admin",
		SV: "sv",
		GV: "gv",
	},
};

export { CONST };
