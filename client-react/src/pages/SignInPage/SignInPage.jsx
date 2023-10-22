import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/authSlice";
import { selectUser } from "../../redux/selectors";
import { routes } from "../../routes";
import { getUser } from "../../services/userServices";
import { validateEmail, validatePassword } from "../../utils/helpers";
import { axiosPost, url } from "../../utils/httpRequest";
import { useLoadingService } from "../../contexts/loadingContext";
import { Button, TextField } from "@mui/material";
import { TRANSLATE } from "../../utils/word";
import "./SignIn.css";
import axios from "axios";
import { UserService } from "./UserService";
import { CONST } from "../../utils/const";
import { updateUser } from "../../redux/userSlice";

const initState = {
	email: "",
	password: "",
};

export default function SignInPage() {
	const loadingService = useLoadingService();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const next = searchParams.get("next");
	const emailRef = useRef();
	const passwordRef = useRef();
	const currentUser = useSelector(selectUser);
	const [showPw, setShowPw] = useState(false);
	const [error, setError] = useState(initState);
	const [formData, setFormData] = useState(initState);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	let canNext = false;

	if (currentUser) {
		//call api get new refresh-token and access-token
		return <Navigate to={routes.OVERVIEW} />;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		console.log(formData);
		const email = formData.email;
		const password = formData.password;
		validateEmail(errors, email);
		validatePassword(errors, password);
		if (Object.keys(errors).length) {
			console.log(error);
			setError(errors);
		} else {
			setError({
				...initState,
			});
			const signInRequest = async () => {
				loadingService.setLoading(true);
				try {
					var res = await UserService.login(formData);
					const data = res.data?.data;
					if (res.data?.code === CONST.API_RESPONSE.SUCCESS) {
						toast.success("Đăng nhập thành công");
						dispatch(updateUser(data.user));
						dispatch(loginSuccess({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
						if (next) {
							navigate(next, {
								replace: true,
							});
						} else {
							navigate(routes.OVERVIEW);
						}
					} else {
						if (data.user.isBlock) {
							toast.error("Tài khoản của bạn đã bị khóa");
						} else {
							toast.error("Bạn không có quyền đăng nhập");
						}
					}
					// const userRes = await getUser(res.accessToken, res.refreshToken, dispatch);
					// if (userRes.isSuccess) {
					// 	dispatch(loginSuccess({ accessToken: res.accessToken, refreshToken: res.refreshToken }));
					// 	if (next) {
					// 		navigate(next, {
					// 			replace: true,
					// 		});
					// 	} else {
					// 		navigate(routes.OVERVIEW);
					// 	}
					// } else {
					// 	if (userRes.isBlock) {
					// 		toast.error("Tài khoản của bạn đã bị khóa");
					// 	} else {
					// 		toast.error("Bạn không có quyền đăng nhập!");
					// 	}
					// }
				} catch (error) {
					console.log(error);
					toast.error("Tài khoản hoặc mật khẩu không đúng");
				}
				loadingService.setLoading(false);
			};
			signInRequest();
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	// if (canNext) {
	// 	return <Navigate to={next} />;
	// }
	if (currentUser) {
		return <Navigate to={routes.OVERVIEW} />;
	}
	return (
		<div>
			<div className="row wrapper">
				<div className="col-12 col-md-6 left">
					<div className="form-header">
						<h2 className="left-h2">
							PTITHCM <span className="left-h2-highlight">Test</span>
						</h2>
						<h3 className="left-h3">Đăng nhập</h3>
					</div>
					<div className="form-content">
						<form onSubmit={handleSubmit} className="mb-2 login-form">
							<TextField
								label="Email"
								variant="outlined"
								type="email"
								name="email"
								fullWidth
								margin="normal"
								value={formData.email}
								onChange={handleChange}
								error={Boolean(error.email)}
								helperText={error.email}
							/>
							<TextField
								label="Mật khẩu"
								variant="outlined"
								fullWidth
								type="password"
								name="password"
								margin="normal"
								value={formData.password}
								onChange={handleChange}
								error={Boolean(error.password)}
								helperText={error.password}
							/>
							<Button className="mt-3 btn-submit" variant="contained" color="primary" type="submit">
								<i className="fa-solid fa-right-to-bracket me-2"></i> Đăng nhập
							</Button>
						</form>
						<div className="form-footer">
							<Link>
								<span>Quên mật khẩu</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="d-none d-md-block col-md-6 right">
					<div className="right-overlay">
						<h4 className="right-text">Học viện Công nghệ Bưu chính Viễn thông</h4>
						<h4 className="right-text">cơ sở tại thành phố Hồ Chí Minh</h4>
					</div>
				</div>
			</div>
		</div>
		/*<div className="container-xxl bg-white d-flex p-0">
			<div className="container-fluid">
				<div className="row h-100 min-vh-100 align-items-center justify-content-center">
					<div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
						<form onSubmit={handleSubmit} className="bg-light bg-gradient rounded p-3 p-sm-4 my-4 mx-3">
							<div className="d-flex align-items-center justify-content-center mb-3">
								<h4>Đăng nhập</h4>
							</div>
							<div className="mb-3">
								<label htmlFor="Username" className="form-label">
									Email
								</label>
								<input
									ref={emailRef}
									onChange={() => {
										handleChange("email");
									}}
									className={`form-control ${errors.email ? "is-invalid" : ""}`}
									id="Username"
									type="email"
								/>
								<div className="invalid-feedback">{errors.email}</div>
							</div>
							<div className="mb-4">
								<label htmlFor="Password" className="form-label">
									Mật khẩu
								</label>
								<input
									ref={passwordRef}
									onChange={() => {
										handleChange("password");
									}}
									type={`${showPw ? "text" : "password"}`}
									className={`form-control ${errors.password ? "is-invalid" : ""}`}
									id="Password"
								/>
								<div className="invalid-feedback">{errors.password}</div>
							</div>
							<div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
								<div className="form-check">
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setShowPw(true);
											} else {
												setShowPw(false);
											}
										}}
										type="checkbox"
										id="check-password"
										className="form-check-input"
									/>
									<label htmlFor="check-password" className="form-check-label">
										Hiện mật khẩu!
									</label>
								</div>
								<Link to={routes.forgotPassword}>Quên mật khẩu?</Link>
							</div>
							<button type="submit" className="btn btn-primary w-100 py-2 mb-4">
								Đăng nhập
							</button>
							<p className="text-center mb-0">
								{"Chưa có tài khoản? "}
								<Link to={routes.signUp}>Đăng ký</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>*/
	);
}
