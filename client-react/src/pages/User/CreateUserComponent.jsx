import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { UserService } from "./UserService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { CONST } from "../../utils/const";

const initialValues = {
	id: "",
	avatar: "",
	firstName: "",
	lastName: "",
	email: "",
	gender: "",
	type: "",
	password: "",
	dateOfBirth: "",
};

const CreateUserComponent = ({ onSubmit, data, type, btnTitle }) => {
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const GENDER = CONST.USER.GENDER;
	const TYPE = CONST.USER.TYPE;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleFileChange = (e) => {
		const { name, value } = e.target;
		if (e.target.files[0]) {
			setFormData({ ...formData, avatar: e.target.files[0] });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		Object.keys(errors).forEach((item) => {
			if (FeHelpers.isStringEmpty(errors[item])) {
				errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
			}
		});

		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}

		switch (type) {
			case CONST.DIALOG.TYPE.EDIT:
				UserService.updateUser(formData, accessToken)
					.then((response) => {
						if (response.data?.code === "SUCCESS") {
							toast.success("Chỉnh sửa người dùng thành công!");
							onSubmit(response.data);
						} else {
							toast.error(
								`Chỉnh sửa người dùng thất bại. Lỗi: ${
									response.data.message ? response.data.message : "Không xác định!"
								}`,
							);
						}
					})
					.catch((err) => console.log("Error when updating user: ", err));
				break;
			case CONST.DIALOG.TYPE.CREATE:
				UserService.createUser(formData, accessToken)
					.then((response) => {
						if (response.data?.code === "SUCCESS") {
							toast.success("Tạo người dùng thành công!");
							onSubmit(response.data);
						} else {
							toast.error(
								`Tạo người dùng thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
							);
						}
					})
					.catch((err) => console.log("Error when creating user: ", err));
				break;
		}
	};

	function isView() {
		return type === "VIEW";
	}

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<TextField
					label="Họ"
					variant="outlined"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					fullWidth
					error={errors.firstName}
					margin="normal"
				/>
				<TextField
					label="Tên"
					variant="outlined"
					name="lastName"
					value={formData.lastName}
					error={errors.lastName}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Email"
					variant="outlined"
					name="email"
					type="email"
					value={formData.email}
					error={errors.email}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Mật khẩu"
					type="password"
					variant="outlined"
					name="password"
					value={formData.password}
					error={errors.password}
					autoComplete="current-password"
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					select
					fullWidth
					name="gender"
					label="Giới tính"
					variant="outlined"
					value={formData.gender}
					error={errors.gender}
					onChange={handleChange}
					margin="normal">
					{Object.keys(GENDER).map((gender, index) => (
						<MenuItem key={index} value={GENDER[gender]}>
							{FeHelpers.translateGender(GENDER[gender])}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					fullWidth
					name="type"
					label="Loại"
					variant="outlined"
					value={formData.type}
					error={errors.type}
					onChange={handleChange}
					margin="normal">
					{Object.keys(TYPE).map((type, index) => (
						<MenuItem key={index} value={TYPE[type]}>
							{FeHelpers.translateUserType(TYPE[type])}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Ngày sinh"
					variant="outlined"
					name="dateOfBirth"
					value={formData.dateOfBirth}
					error={errors.dateOfBirth}
					onChange={handleChange}
					fullWidth
					type="date"
					margin="normal"
					InputLabelProps={{ shrink: true }}
				/>
				<div>
					<TextField
						variant="outlined"
						name="avatar"
						label="avatar"
						// value={formData.avatar}
						// error={errors.avatar}
						onChange={handleFileChange}
						fullWidth
						type="file"
						margin="normal"
						InputLabelProps={{ shrink: true }}
					/>
				</div>
				{isView() ? null : (
					<div className="form-footer">
						<Button type="submit" variant="contained" color="primary" className="mt-3 px-4">
							<i className="fa-solid fa-floppy-disk me-2"></i> {btnTitle || "Lưu"}
						</Button>
					</div>
				)}
			</form>
		</Container>
	);
};

export default CreateUserComponent;
