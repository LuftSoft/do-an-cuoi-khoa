import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { selectUser } from "../../redux/selectors";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";
import { UserService } from "../Auth/UserService";
import { validatePassword } from "../../utils/helpers";

const initState = {
	token: "",
	newPassword: "",
	reNewPassword: "",
};

export default function SignInPage() {
	const loadingService = useLoadingService();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const currentUser = useSelector(selectUser);
	const [error, setError] = useState(initState);
	const [formData, setFormData] = useState(initState);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	if (currentUser) {
		//call api get new refresh-token and access-token
		return <Navigate to={routes.OVERVIEW} />;
	}
	useEffect(() => {
		setFormData({ ...formData, token: searchParams.get("token") });
	}, []);
	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		if (formData.newPassword !== formData.reNewPassword) {
			toast.error("Mật khẩu không khớp, vui lòng nhập lại");
			return;
		}
		validatePassword(errors, formData.newPassword, "newPassword");
		console.log("errors", errors);
		if (Object.keys(errors).length > 0) {
			setError(errors);
			return;
		}
		const resetPassword = async () => {
			loadingService.setLoading(true);
			try {
				var res = await UserService.resetPassword(formData);
				if (res.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Đặt lại mật khẩu thành công");
					navigate(routes.SIGNIN);
				} else {
					toast.error(`Đặt lại mật khẩu thất bại: ${res.data?.message}`);
				}
			} catch (error) {
				console.log(error);
				toast.error("Đặt lại mật khẩu thất bại" + error);
			}
			loadingService.setLoading(false);
		};
		resetPassword();
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
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
						<h3 className="left-h3">Đặt lại mật khẩu</h3>
					</div>
					<div className="form-content">
						<form onSubmit={handleSubmit} className="mb-2 login-form">
							<TextField
								label="Mật khẩu mới"
								variant="outlined"
								type="password"
								name="newPassword"
								fullWidth
								required={true}
								margin="normal"
								value={formData.newPassword}
								onChange={handleChange}
								error={Boolean(error.newPassword)}
								helperText={error.newPassword}
							/>
							<TextField
								label="Nhập lại mật khẩu mới"
								variant="outlined"
								type="password"
								required={true}
								name="reNewPassword"
								fullWidth
								margin="normal"
								value={formData.reNewPassword}
								onChange={handleChange}
								error={Boolean(error.newPassword)}
								helperText={error.newPassword}
							/>
							<Button className="mt-3 btn-submit" variant="contained" color="primary" type="submit">
								<i className="fa-solid fa-right-to-bracket me-2"></i> Đặt lại mật khẩu
							</Button>
						</form>
						<div className="form-footer">
							<Link to={routes.FORGOT_PASSWORD} className="me-2 underline">
								<span>Quên mật khẩu</span>
							</Link>
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
