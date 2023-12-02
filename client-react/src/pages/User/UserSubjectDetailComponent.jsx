import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, MenuItem, Avatar } from "@mui/material";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { UserService } from "./UserService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import dayjs from "dayjs";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import CreateUserSubjectComponent from "./CreateUserSubjectComponent";

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
const columnDef = [
	{
		colName: "Chủ sở hữu",
		colDef: "full_name",
	},
	{
		colName: "Email",
		colDef: "email",
	},
	{
		colName: "Loại",
		colDef: "type_translate",
	},
	{
		colName: "Môn học",
		colDef: "subject_name",
	},
];
const UserSubjectDetailComponent = ({ id }) => {
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const [previewAvatar, setPreviewAvatar] = useState("");
	const [user, setUser] = useState({});
	const GENDER = CONST.USER.GENDER;
	const TYPE = CONST.USER.TYPE;
	const [dataSource, setDataSource] = useState([]);
	const [createUserSubjectData, setCreateUserSubjectData] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [userClusterSubject, setUserClusterSubject] = useState(null);
	const [openCreateUserSubjectDialog, setOpenCreateUserSubjectDialog] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			loadingService.setLoading(true);
			await getUserDetail(id);
			await getUserClusterDetail(id);
			loadingService.setLoading(false);
		};
		fetchData();
	}, []);

	const getUserDetail = async (id) => {
		try {
			const response = await UserService.getUser(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				if (response.data?.data?.avatar) {
					let fileBase64 = "";
					fileBase64 = FeHelpers.arrayBufferToBase64(response.data?.data?.avatar?.data);
					setPreviewAvatar(fileBase64);
				}
				setUser(response?.data?.data);
			} else {
				toast.error("Tải chi người dùng thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải chi tiết người dùng");
		}
	};
	const getUserClusterDetail = async (id) => {
		try {
			const response = await UserService.getUserClusterSubjectByUserId(id, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				response.data?.data.forEach((user) => {
					user.full_name = `${user.firstName} ${user.lastName}`;
					user.type_translate = FeHelpers.translateUserType(user.type);
					user.className = {};
					switch (user?.type) {
						case CONST.USER.TYPE.SV:
							user.className.type_translate = "bg-easy";
							break;
						case CONST.USER.TYPE.GV:
							user.className.type_translate = "bg-medium";
							break;
						default:
							break;
					}
				});
				setDataSource(response.data?.data);
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			toast.error("Tải danh sách tài khoản thất bại");
		}
	};
	const handleDelete = async (row) => {
		console.log(row);
		setUserClusterSubject(row);
		setOpenConfirmDialog(true);
	};
	const getPreviewStr = (previewAvatar) => {
		if (previewAvatar.substring(0, 4) === "blob") {
			return previewAvatar;
		} else {
			return `data:image/png;base64,${previewAvatar}`;
		}
	};
	const handleConfirmDialog = async (data) => {
		setOpenConfirmDialog(false);
		if (data) {
			try {
				const response = await UserService.deleteUserClusterSubject(userClusterSubject.user_cluster_subject_id);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa quyền bộ câu hỏi thành công");
					await getUserClusterDetail(id);
				} else {
					toast.error("Xóa quyền bộ câu hỏi thất bại");
				}
			} catch (err) {
				toast.error("Xóa quyền bộ câu hỏi thất bại");
			}
		}
	};
	const onClose = () => {
		setOpenConfirmDialog(false);
		setOpenCreateUserSubjectDialog(false);
	};
	const handleAddUserClusterSubject = (type) => {
		switch (type) {
			case "subject":
				setCreateUserSubjectData({
					type: "subject",
					user_id: user.id,
				});
				break;
			case "role":
				setCreateUserSubjectData({
					type: "role",
					user_id: user.id,
				});
				break;
			default:
				break;
		}
		setOpenCreateUserSubjectDialog(true);
	};
	const handleCreateUserSubject = async (data) => {
		await getUserClusterDetail(id);
		setOpenCreateUserSubjectDialog(false);
	};
	return (
		<Box style={{ padding: "0 24px 24px 24px" }}>
			<form>
				<div className="row">
					<div className="col-md-3 col-12">
						<Avatar
							alt="Remy Sharp"
							src={previewAvatar ? getPreviewStr(previewAvatar) : "../../../public/img/user-avatar.png"}
							sx={{ width: 100, height: 100 }}
						/>
					</div>
					<div className="col-md-9 col-12">
						<TextField
							fullWidth
							name="gender"
							label="Tên người dùng"
							variant="outlined"
							value={user.firstName + " " + user.lastName}
							margin="normal"></TextField>
						<div className="row">
							<div className="col-6">
								<TextField
									label="Email"
									variant="outlined"
									fullWidth
									name="dateOfBirth"
									value={user.email}
									margin="normal"
									InputLabelProps={{ shrink: true }}
								/>
							</div>
							<div className="col-4">
								<TextField
									fullWidth
									name="code"
									label="Mã nhân viên"
									variant="outlined"
									value={user.code}
									InputLabelProps={{ shrink: true }}
									margin="normal"
								/>
							</div>
							<div className="col-2">
								<TextField
									fullWidth
									name="code"
									label="Loại"
									variant="outlined"
									value={user.type === CONST.USER.TYPE.GV ? "Giảng viên" : "Sinh viên"}
									InputLabelProps={{ shrink: true }}
									margin="normal"
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
			<hr className="my-3" />
			<div className="d-flex justify-content-end">
				<Button variant="contained" onClick={() => handleAddUserClusterSubject("subject")} className="me-2">
					Thêm môn học
				</Button>
				<Button variant="contained" onClick={() => handleAddUserClusterSubject("role")}>
					Thêm quyền bộ câu hỏi
				</Button>
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}></CommonTableComponent>
			<CommonDialogComponent
				open={openConfirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog
					message="Bạn muốn xóa bộ câu hỏi khỏi người dùng này?"
					handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openCreateUserSubjectDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<CreateUserSubjectComponent
					data={createUserSubjectData}
					onSubmit={handleCreateUserSubject}></CreateUserSubjectComponent>
			</CommonDialogComponent>
		</Box>
	);
};

export default UserSubjectDetailComponent;
