import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { useLoadingService } from "../../contexts/loadingContext";
import { selectAccessToken } from "../../redux/selectors";
import { updateUser } from "../../redux/userSlice";
import { FeHelpers } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import "./User.css";
import { UserService } from "./UserService";
import { routes } from "../../routes";
import { logout } from "../../services/userServices";

const initialValues = {
	oldPassword: "",
	newPassword: "",
	renewPassword: "",
};

const UserChangePasswordComponent = () => {
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const buttons = [];
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = {};
		Object.keys(formData).forEach((item) => {
			if (!FeHelpers.checkPassword(formData[item])) {
				errors[item] = `Mật khẩu phải gồm chữ thường, chữ hoa và số.`;
			}
		});
		if (Object.keys(errors).length === 0 && formData.newPassword !== formData.renewPassword) {
			errors.renewPassword = "Mật khẩu mới không khớp! Vui lòng nhập lại.";
		}
		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}
		try {
			loadingService.setLoading(true);
			const response = await UserService.changePassword(formData, accessToken);
			if (response.data?.code === "SUCCESS") {
				toast.success("Thay đổi mật khẩu thành công.");
				setTimeout(() => {
					logout(dispatch);
				}, 200);
			} else {
				toast.error(`Thay đổi mật khẩu thất bại.`);
			}
			loadingService.setLoading(false);
		} catch (err) {
			console.log("Error when updating user: ", err);
			toast.error(`Thay đổi mật khẩu thất bại.`);
			loadingService.setLoading(false);
		}
	};
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<div className="mb-3">
				<TitleButtonComponent title={"Thay đổi mật khẩu"} buttons={buttons} />
			</div>
			<div className="row">
				<div className="col-3"></div>
				<div className="col-6">
					<div style={{ fontWeight: "bold" }}>
						<i class="fa-solid fa-circle-info me-2"></i>Mật khẩu có ít nhất 6 kí tự. Bao gồm chữ thường, chữ hoa và số
					</div>
					<form onSubmit={handleSubmit} encType="multipart/form-data">
						<TextField
							required
							InputProps={{
								inputProps: {
									minLength: 6,
									maxLength: 120,
								},
							}}
							label="Mật khẩu hiên tại"
							type="password"
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							name="oldPassword"
							value={formData.password}
							error={Boolean(errors.password)}
							helperText={errors.password}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							required
							InputProps={{
								inputProps: {
									minLength: 6,
									maxLength: 120,
								},
							}}
							label="Mật khẩu mới"
							type="password"
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							name="newPassword"
							value={formData.newPassword}
							error={Boolean(errors.newPassword)}
							helperText={errors.newPassword}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							required
							InputProps={{
								inputProps: {
									minLength: 6,
									maxLength: 120,
								},
							}}
							label="Nhập lại mật khẩu mới"
							type="password"
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							name="renewPassword"
							value={formData.renewPassword}
							error={Boolean(errors.renewPassword)}
							helperText={errors.renewPassword}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<div className="form-footer">
							<Button type="submit" variant="contained" color="primary" className="mt-3 px-4">
								<i className="fa-solid fa-floppy-disk me-2"></i> {"Thay đổi mật khẩu"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Container>
	);
};

export default UserChangePasswordComponent;
