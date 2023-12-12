import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Avatar, Container, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { UserService } from "./UserService";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import "./User.css";
import { updateUser } from "../../redux/userSlice";

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

const UserSettingComponent = () => {
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const currentUser = useSelector(selectUser);
	const [user, setUser] = useState({});
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const [previewAvatar, setPreviewAvatar] = useState();
	const GENDER = CONST.USER.GENDER;
	const TYPE = CONST.USER.TYPE;
	const avatarRef = useRef(null);
	const dispatch = useDispatch();
	const buttons = [];

	useEffect(() => {
		const fetchData = async () => {
			await getUser();
		};
		fetchData();
	}, []);
	useEffect(() => {
		return () => {
			previewAvatar ? URL.revokeObjectURL(previewAvatar) : null;
		};
	}, [previewAvatar]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleFileChange = (e) => {
		if (e.target.files[0]) {
			setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
			setFormData({ ...formData, avatar: e.target.files[0] });
		}
	};
	const handleFileChoose = () => {
		if (avatarRef) {
			avatarRef.current.click();
		}
	};
	const getUser = async () => {
		if (currentUser) {
			loadingService.setLoading(true);
			const response = await UserService.getUser(currentUser.id).catch((err) => loadingService.setLoading(false));
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setUser(response.data?.data);
				if (response.data?.data?.avatar) {
					let fileBase64 = "";
					fileBase64 = FeHelpers.arrayBufferToBase64(response.data?.data?.avatar?.data);
					setPreviewAvatar(fileBase64);
				}
				convertToFromData(response.data?.data);
			}
			loadingService.setLoading(false);
		}
	};
	function convertToFromData(user) {
		let tmp = {};
		Object.keys(user).forEach((key) => {
			if (formData[key] != undefined) {
				tmp[key] = user[key] || "";
			}
		});
		tmp.dateOfBirth = tmp.dateOfBirth ? tmp.dateOfBirth.substring(0, 10) : "";
		setFormData(tmp);
	}
	const handleSubmit = async (e) => {
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
		let submitData = user;
		Object.keys(formData).forEach((item) => {
			submitData[item] = formData[item];
		});
		const formSubmitData = new FormData();
		Object.keys(submitData).forEach((item) => {
			formSubmitData.append(item, submitData[item]);
		});
		try {
			loadingService.setLoading(true);
			const response = await UserService.updateUser(formSubmitData, accessToken);
			if (response.data?.code === "SUCCESS") {
				toast.success("Chỉnh sửa người dùng thành công!");
				dispatch(updateUser(response.data?.data));
			} else {
				toast.error(
					`Chỉnh sửa người dùng thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
				);
			}
			loadingService.setLoading(false);
		} catch (err) {
			console.log("Error when updating user: ", err);
			loadingService.setLoading(false);
		}
	};
	const getPreviewStr = (previewAvatar) => {
		if (previewAvatar.substring(0, 4) === "blob") {
			return previewAvatar;
		} else {
			return `data:image/png;base64,${previewAvatar}`;
		}
	};
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<div className="mb-3">
				<TitleButtonComponent title={"thông tin cá nhân"} buttons={buttons} />
			</div>
			<div className="row">
				<div className="col-3 mt-16 center-item">
					<Avatar
						alt="Remy Sharp"
						src={previewAvatar ? getPreviewStr(previewAvatar) : "../../../public/img/user-avatar.png"}
						sx={{ width: 220, height: 220 }}
					/>
					<div>
						<input
							name="avatar"
							ref={avatarRef}
							accept="image/*"
							style={{ display: "none" }}
							onChange={handleFileChange}
							type="file"
						/>
						<Button onClick={handleFileChoose} variant="contained" color="primary" className="mt-3 px-4">
							<i className="fa-regular fa-folder-open me-2"></i> {"Chọn ảnh đại diện"}
						</Button>
					</div>
				</div>
				<div className="col-9">
					<form onSubmit={handleSubmit} encType="multipart/form-data">
						<div className="row">
							<div className="col-7">
								<TextField
									fullWidth
									label="Họ"
									variant="outlined"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									error={errors.firstName}
									margin="normal"
								/>
							</div>
							<div className="col-5">
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
							</div>
						</div>
						<div className="row">
							<div className="col-4">
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
							</div>
							<div className="col-4">
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
							</div>
							<div className="col-4">
								<TextField
									fullWidth
									disabled
									name="type"
									variant="outlined"
									value={formData.type === CONST.USER.TYPE.GV ? "Giảng viên" : "Sinh viên"}
									error={errors.type}
									margin="normal"></TextField>
							</div>
						</div>
						<TextField
							label="Email"
							variant="outlined"
							name="email"
							type="email"
							disabled
							value={formData.email}
							error={errors.email}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						{/* <TextField
							label="Mật khẩu"
							type="password"
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							name="password"
							value={formData.password}
							error={errors.password}
							autoComplete="current-password"
							onChange={handleChange}
							fullWidth
							margin="normal"
						/> */}
						<div className="form-footer">
							<Button type="submit" variant="contained" color="primary" className="mt-3 px-4">
								<i className="fa-solid fa-floppy-disk me-2"></i> {"Lưu thông tin"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Container>
	);
};

export default UserSettingComponent;
