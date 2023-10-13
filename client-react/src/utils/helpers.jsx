import { Outlet, Route } from "react-router-dom";

import DefaultLayout from "../layouts/DefaultLayout";

export const renderRoutes = (routes) => {
	let reactElements = null;
	if (Array.isArray(routes)) {
		reactElements = routes.map((route, index) => {
			const Layout = route.layout ?? DefaultLayout; // null or undefined
			const Page = route?.page;
			if (!Layout) {
				throw new Error("Layout is undefined!");
			}
			if (!Page) {
				throw new Error("Page is undefined!");
			}
			const children = route.children;
			if (children?.length) {
				return (
					<Route key={index} path={route.path} element={<Outlet />}>
						<Route index element={<Layout></Layout>} />
						{children.map((childRoute) => {
							const ChildPage = childRoute.component;
							return (
								<Route
									key={childRoute.key}
									path={childRoute.path}
									element={
										<Layout>
											<ChildPage />
										</Layout>
									}
								/>
							);
						})}
					</Route>
				);
			} else {
				return (
					<Route
						key={index}
						path={route.path}
						element={
							<Layout>
								<Page />
							</Layout>
						}
					/>
				);
			}
		});
		return reactElements;
	} else {
		throw new Error("Routes must be an array!");
	}
};
export const dateToString = (stringDate) => {
	const date = new Date(stringDate);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${day}/${month}/${year}`;
};
export const formatDate = (date, pattern = "yyyy-mm-dd", seperater = "-") => {
	if (date instanceof Date) {
		let rs = null;
		switch (pattern.toLowerCase()) {
			case "yyyy-mm-dd":
				rs = `${date.getFullYear()}${seperater}${
					date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
				}${seperater}${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
				break;
			case "dd-mm-yyyy":
				rs = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}${seperater}${
					date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
				}${seperater}${date.getFullYear()}`;
				break;
			default:
				throw new Error("date pattern is not founded!");
		}
		return rs;
	} else {
		throw new Error("Is Not A Date!");
	}
};
export const validateEmail = (errors, username) => {
	if (username === "") {
		errors.email = "Vui lòng nhập email!";
	}
};
export const validatePassword = (errors, password, key = "password") => {
	const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
	if (password === "") {
		errors[key] = "Vui lòng nhập mật khẩu!";
	} else if (!decimal.test(password)) {
		errors[key] = "Mật khẩu tối thiểu 6 ký tự. Chứa ít nhất 1 ký tự in hoa, 1 ký tự số và 1 ký tự đặc biệt";
	}
};
export const validatePhone = (errors, phone) => {
	const phoneRegex = /^0[1-9]{1}[0-9]{8,9}$/;
	if (phone === "") {
		errors.phone = "Vui lòng nhập số điện thoại!";
	} else if (!phoneRegex.test(phone)) {
		errors.phone = "Số điện thoại không đúng định dạng! Ví dụ: 0234242524";
	}
};

async function fetchFileFromUrl(url) {
	try {
		const response = await fetch(url);
		const data = await response.blob();
		const filename = getFileNameFromUrl(url); // Helper function to extract filename from URL
		return new File([data], filename);
	} catch (error) {
		console.error("Error fetching file:", error);
		return null;
	}
}

function getFileNameFromUrl(url) {
	const urlParts = url.split("/");
	return urlParts[urlParts.length - 1];
}

// Usage example:
// const url = "https://example.com/sample.pdf";
// const file = fetchFileFromUrl(url);

// file.then((fileObj) => {
// 	if (fileObj) {
// 		console.log("File object:", fileObj);
// 		// You can now use the 'fileObj' like a File object.
// 		// For example, you can pass it to a FormData or upload it to a server.
// 	} else {
// 		console.log("Failed to fetch the file.");
// 	}
// });

async function setFileInInput(url, inputId) {
	const file = await fetchFileFromUrl(url);
	if (file) {
		const inputElement = document.getElementById(inputId);
		const fileList = new DataTransfer();
		fileList.items.add(file);
		inputElement.files = fileList.files;
	} else {
		console.log("Failed to fetch the file.");
	}
}
export const generateUniqueId = (length) => {
	if (length <= 0) length = 1;
	let result = [];
	for (let i = 0; i < length; i++) {
		result.push(
			Math.floor((Math.random() + 1) * 0x10000)
				.toString(16)
				.substring(1),
		);
	}
	return result.join("-");
};
// Usage example
const urlLogo =
	"http://res.cloudinary.com/dnshdled2/image/upload/v1688477770/hotel_management/fileupload-2023-07-04-08-36-10_ghfiuh.jpg";

const inputId = "myFileInput";
// setFileInInput(urlLogo, inputId);
