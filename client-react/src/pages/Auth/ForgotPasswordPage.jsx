import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { loginSuccess } from "../../redux/authSlice";
import { selectUser } from "../../redux/selectors";
import { updateUser } from "../../redux/userSlice";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";
import { validateEmail, validatePassword } from "../../utils/helpers";
import "./SignIn.css";
import { UserService } from "./UserService";

const initState = {
	email: "",
};

export default function SignInPage() {
	const loadingService = useLoadingService();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const next = searchParams.get("next");
	const currentUser = useSelector(selectUser);
	const [error, setError] = useState(initState);
	const [formData, setFormData] = useState(initState);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (currentUser) {
			return <Navigate to={routes.OVERVIEW} />;
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		const email = formData.email;
		validateEmail(errors, email);
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
					var res = await UserService.forgotPassword(formData);
					if (res.data?.code === CONST.API_RESPONSE.SUCCESS) {
						toast.success("Gửi email đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn để đặt lại mật khẩu");
						navigate(routes.SIGNIN);
					} else {
						toast.error(res?.data?.message);
					}
				} catch (error) {
					console.log(error);
					toast.error(error.message);
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
	return (
		<div>
			<div className="row wrapper">
				<div className="col-12 col-md-6 left">
					<div className="form-header">
						<h2 className="left-h2">
							PTITHCM <span className="left-h2-highlight">Test</span>
						</h2>
						<h3 className="left-h3">Quên mật khẩu</h3>
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
							<Button className="mt-3 btn-submit" variant="contained" color="primary" type="submit">
								<i className="fa-solid fa-right-to-bracket me-2"></i> Gửi mail khôi phục mật khẩu
							</Button>
						</form>
						<div className="form-footer">
							<Link to={routes.SIGNIN} className="underline">
								<span>Đăng nhập</span>
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
	);
}
