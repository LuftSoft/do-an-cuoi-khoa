export const CONST = {
	SIDEBAR: [
		{
			icon: "fa-solid fa-house",
			name: "Tổng quan",
			route: "/",
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
					name: "Giảng viên",
					route: "",
				},
				{
					name: "Sinh viên",
					route: "",
				},
			],
		},
		{
			icon: "fa-solid fa-book",
			name: "Môn học",
			route: "",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-clipboard-question",
			name: "Câu hỏi",
			route: "",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-users",
			name: "Lớp tín chỉ",
			route: "",
			permissions: [],
			childs: [],
		},
		{
			icon: "fa-solid fa-calendar-days",
			name: "Lịch kiểm tra",
			route: "",
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
					route: "",
				},
				{
					name: "Kết quả",
					route: "",
				},
			],
		},
	],
};
