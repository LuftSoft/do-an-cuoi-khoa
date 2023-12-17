import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, MenuItem, Avatar, FormControlLabel, Checkbox } from "@mui/material";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { UserService } from "./UserService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import dayjs from "dayjs";

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

const CreateUserComponent = ({ onSubmit, data }) => {
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const [previewAvatar, setPreviewAvatar] = useState("");
	const [user, setUser] = useState({});
	const [defaultPasswordChecked, setDefaultPasswordChecked] = useState(true);
	const GENDER = CONST.USER.GENDER;
	const TYPE = CONST.USER.TYPE;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleFileChange = (e) => {
		const { name, value } = e.target;
		if (e.target.files[0]) {
			setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
			setFormData({ ...formData, avatar: e.target.files[0] });
		}
	};
	useEffect(() => {
		const fetchData = async () => {
			if (data?.type === CONST.DIALOG.TYPE.EDIT) {
				await getUserDetail(data?.id);
			}
		};
		fetchData();
	}, []);
	function convertToFromData(user) {
		let tmp = {};
		Object.keys(user).forEach((key) => {
			if (formData[key] != undefined) {
				tmp[key] = user[key] || "";
			}
		});
		tmp.dateOfBirth = tmp.dateOfBirth ? dayjs(tmp.dateOfBirth).format("YYYY-MM-DD") : "";
		setFormData(tmp);
	}
	const getUserDetail = async (id) => {
		try {
			const response = await UserService.getUser(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				if (response.data?.data?.avatar) {
					let fileBase64 = "";
					fileBase64 = FeHelpers.arrayBufferToBase64(response.data?.data?.avatar?.data);
					setPreviewAvatar(fileBase64);
				}
				convertToFromData(response.data?.data);
			} else {
				toast.error("Tải chi người dùng thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải chi tiết người dùng");
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		Object.keys(formData).forEach((item) => {
			if (item === "id" || item === "avatar") return;
			if (item === "password" && data.type !== CONST.DIALOG.TYPE.ADD) return;
			if (FeHelpers.isStringEmpty(formData[item])) {
				errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
			}
			if (data.type === CONST.DIALOG.TYPE.ADD && !FeHelpers.checkPassword(formData.password)) {
				errors.password = `Mật khẩu phải gồm chữ thường, chữ hoa và số.`;
			}
		});

		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}
		//check if no change avatar
		if (formData.avatar.type === "Buffer") {
			formData.avatar = null;
		}
		console.log("formData", formData);
		switch (data.type) {
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
			case CONST.DIALOG.TYPE.ADD:
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
		return data.type === "VIEW";
	}
	const getPreviewStr = (previewAvatar) => {
		if (previewAvatar.substring(0, 4) === "blob") {
			return previewAvatar;
		} else {
			return `data:image/png;base64,${previewAvatar}`;
		}
	};
	const genHelperText = (content) => {
		return `Vui lòng nhập dữ liệu cho ${content}`;
	};
	const handleDefaultPasswordChange = (e) => {
		if (!defaultPasswordChecked) {
			setFormData({ ...formData, password: CONST.USER.DEFAULT_USER_PASSWORD });
		} else {
			setFormData({ ...formData, password: "" });
		}
		setDefaultPasswordChecked(!defaultPasswordChecked);
	};
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<Avatar
					alt="Remy Sharp"
					src={previewAvatar ? getPreviewStr(previewAvatar) : "../../../public/img/user-avatar.png"}
					sx={{ width: 100, height: 100 }}
				/>
				<TextField
					label="Họ"
					variant="outlined"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					fullWidth
					error={Boolean(errors.firstName)}
					helperText={genHelperText("Họ")}
					margin="normal"
				/>
				<TextField
					label="Tên"
					variant="outlined"
					name="lastName"
					value={formData.lastName}
					error={Boolean(errors.lastName)}
					helperText={genHelperText("Tên")}
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
					error={Boolean(errors.email)}
					helperText={errors.email}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				{data.type === CONST.DIALOG.TYPE.ADD ? (
					<TextField
						label="Mật khẩu"
						type="password"
						variant="outlined"
						name="password"
						value={formData.password}
						error={Boolean(errors.password)}
						helperText={errors.password}
						autoComplete="current-password"
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
				) : null}
				{data.type === CONST.DIALOG.TYPE.ADD ? (
					<FormControlLabel
						control={<Checkbox checked={defaultPasswordChecked} onChange={handleDefaultPasswordChange} />}
						label="Sử dụng mật khẩu mặc định"
					/>
				) : null}
				<TextField
					select
					fullWidth
					name="gender"
					label="Giới tính"
					variant="outlined"
					value={formData.gender}
					helperText={genHelperText("Giới tính")}
					error={Boolean(errors.gender)}
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
					error={Boolean(errors.type)}
					helperText={genHelperText("Loại")}
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
					value={dayjs(formData.dateOfBirth).format("YYYY-MM-DD")}
					error={Boolean(errors.dateOfBirth)}
					onChange={handleChange}
					InputProps={{
						inputProps: {
							max: FeHelpers.getMaxDateOfBirth(),
							min: CONST.USER.MIN_DATE_OF_BIRTH,
						},
					}}
					fullWidth
					helperText={genHelperText("Ngày sinh")}
					type="date"
					margin="normal"
					InputLabelProps={{ shrink: true }}
				/>
				<div>
					<TextField
						variant="outlined"
						name="avatar"
						label="avatar"
						inputProps={{ accept: "image/*" }}
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
							<i className="fa-solid fa-floppy-disk me-2"></i> {"Lưu"}
						</Button>
					</div>
				)}
			</form>
		</Container>
	);
};

export default CreateUserComponent;
