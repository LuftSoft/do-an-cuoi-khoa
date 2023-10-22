import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { routes } from "../../routes";
import { useRef, useState } from "react";
import { axiosPost, url } from "../../utils/httpRequest";
import { validateEmail, validatePassword } from "../../utils/helpers";
import "./Signup.css";

const initErrors = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export default function SignUpPage() {
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState(initErrors);
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		const firstName = firstNameRef.current.value;
		const lastName = lastNameRef.current.value;
		const username = emailRef.current.value;
		const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;
		const errors = {};
		if (firstName === "") {
			errors.firstName = "Vui lòng nhập tên!";
		}
		if (lastName === "") {
			errors.lastName = "Vui lòng nhập họ!";
		}
		validateEmail(errors, username);
		validatePassword(errors, password);
		if (confirmPassword === "") {
			errors.confirmPassword = "Vui lòng nhập mật khẩu xác nhận!";
		} else if (password !== confirmPassword) {
			errors.confirmPassword = "Mật khẩu xác nhận không khớp!";
		}
		if (Object.keys(errors).length) {
			setErrors(errors);
		} else {
			setErrors({
				...initErrors,
			});
			const signUpRequest = async () => {
				const toastId = toast.loading("Đang xử lý!");
				try {
					const res = await axiosPost(url.signUp, {
						firstName,
						lastName,
						userName: username,
						password,
						role: ["admin"],
					});
					toast.update(toastId, {
						render: "Đăng ký thành công!",
						type: "success",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
					navigate(routes.signIn);
				} catch (error) {
					console.log(error);
					toast.update(toastId, {
						render: error.response?.data.message || "Không thể đăng ký tài khoản!",
						type: "error",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
				}
			};
			signUpRequest();
		}
	};
	const handleChange = (name) => {
		if (typeof name === "string") {
			setErrors({
				...errors,
				[name]: "",
			});
		} else {
			throw new Error("Name must be string!");
		}
	};
	return (
		<div className="container-xxl bg-white d-flex p-0">
			<div className="container-fluid">
				<div className="row h-100 min-vh-100 align-items-center justify-content-center">
					<div className="col-12 col-sm-8 col-md-6">
						{/* should use form tag */}
						<form
							onSubmit={handleSubmit}
							className="bg-light bg-gradient rounded p-4 p-sm-5 my-4 mx-3 needs-validationc was-validateds">
							<div className="d-flex align-items-center justify-content-between mb-2 mb-lg-3">
								<Link to={routes.home}>
									<h3 className="text-primary text-uppercase">Trang chủ</h3>
								</Link>
								<h3>Đăng ký</h3>
							</div>
							<div className="row">
								<div className="col-12 col-lg-6">
									<div className="mb-2">
										<label htmlFor="first-name" className="form-label">
											Tên
										</label>
										<input
											ref={firstNameRef}
											onChange={() => {
												handleChange("firstName");
											}}
											className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
											id="first-name"
										/>
										<div className="invalid-feedback">{errors.firstName}</div>
									</div>
								</div>
								<div className="col-12 col-lg-6">
									<div className="mb-2">
										<label htmlFor="last-name" className="form-label">
											Họ
										</label>
										<input
											ref={lastNameRef}
											onChange={() => {
												handleChange("lastName");
											}}
											className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
											id="last-name"
										/>
										<div className="invalid-feedback">{errors.lastName}</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-12 col-lg-6">
									<div className="mb-2">
										<label htmlFor="Username" className="form-label">
											Email
										</label>
										<input
											ref={emailRef}
											onChange={() => {
												handleChange("email");
											}}
											type="email"
											maxLength={256}
											className={`form-control ${errors.email ? "is-invalid" : ""}`}
											id="Username"
										/>
										<div className="invalid-feedback">{errors.email}</div>
									</div>
								</div>
								<div className="col-12 col-lg-6">
									<div className="mb-2">
										<label htmlFor="Password" className="form-label">
											Mật khẩu
										</label>
										<input
											ref={passwordRef}
											onChange={() => {
												handleChange("password");
											}}
											type={showPw ? "text" : "password"}
											maxLength={100}
											className={`form-control ${errors.password ? "is-invalid" : ""}`}
											id="Password"
										/>
										<div className="invalid-feedback">{errors.password}</div>
									</div>
								</div>
							</div>
							<div className="row align-items-center">
								<div className="col-12 col-lg-6">
									<div className="mb-2">
										<label htmlFor="confirm-password" className="form-label">
											Xác nhận mật khẩu
										</label>
										<input
											ref={confirmPasswordRef}
											onChange={() => {
												handleChange("confirmPassword");
											}}
											type={showPw ? "text" : "password"}
											className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
											id="confirm-password"
										/>
										<div className="invalid-feedback">{errors.confirmPassword}</div>
									</div>
								</div>
								<div className="col-12 col-lg-6">
									<div className="d-flex align-items-center justify-content-between mt-2">
										<div className="form-check">
											<input
												type="checkbox"
												onClick={(e) => {
													if (e.target.checked) {
														setShowPw(true);
													} else {
														setShowPw(false);
													}
												}}
												id="check-password"
												className="form-check-input"
											/>
											<label htmlFor="check-password" className="form-check-label">
												Hiện mật khẩu!
											</label>
										</div>
									</div>
								</div>
							</div>
							<button type="submit" className="btn btn-primary w-100 py-3 mt-4 mt-lg-2 mb-lg-4">
								Đăng ký
							</button>
							<p className="text-center mb-0">
								{"Đã có tài khoản? "}
								<Link to={routes.signIn}>Đăng nhập</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
