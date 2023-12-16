import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateUserComponent } from ".";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { selectAccessToken } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import { UserService } from "./UserService";
import { FeHelpers } from "../../utils/helpers";
import CommonListComponent from "../../components/Common/CommonList/CommonListComponent";
const columnDef = [
	{
		colName: "Họ và tên",
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
		colName: "Hình ảnh",
		colDef: "avatar",
	},
	{
		colName: "Giới tính",
		colDef: "gender_translate",
	},
	{
		colName: "Ngày sinh",
		colDef: "dateOfBirth",
	},
];
export default function AssignUserRoleComponent() {
	const title = "Quản lý quyền";
	const buttons = [
		{
			name: "Thêm tài khoản",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
	const [users, setUsers] = useState([]);
	const [userFilters, setUserFilters] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [roles, setRoles] = useState([]);
	const [rolePermissions, setRolePermissions] = useState([]);
	const [userRoles, setUserRoles] = useState([]);
	const [selectedRole, setSelectedRole] = useState(null);
	const [userDialogData, setUserDialogData] = useState({
		type: CONST.DIALOG.TYPE.ADD,
		id: null,
	});
	const ADMIN = "admin";
	const accessToken = useSelector(selectAccessToken);
	async function getRoles() {
		try {
			const response = await UserService.getRoles();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				console.log(response.data?.data);
				setRoles(response.data?.data?.filter((item) => item.name !== ADMIN));
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	async function getPermissionByRole(id) {
		try {
			const response = await UserService.getPermissionByRole(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setRolePermissions(response.data?.data);
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	async function getUserByRole(id) {
		try {
			const response = await UserService.getUserByRole(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setUserRoles(response.data?.data);
				handleFilterUserTable(response.data?.data);
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			console.log(err);
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	function handleFilterUserTable(data) {
		const listUserId = data?.map((i) => i.user_id);
		setUserFilters(
			users.filter((u) => {
				return !listUserId.includes(u.id);
			}) || [],
		);
	}
	async function getUsers() {
		try {
			const response = await UserService.getAllUser();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				response.data?.data.forEach((user) => {
					user.full_name = `${user?.firstName} ${user?.lastName}`;
					user.dateOfBirth = user?.dateOfBirth?.substring(0, 10);
					user.gender_translate = FeHelpers.translateGender(user?.gender);
					user.type_translate = FeHelpers.translateUserType(user?.type);
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
					user.avatar = `<img class="avatar-small" src="data:image/png;base64,${user.avatar}" alt="avatar" />`;
				});
				setUsers(response.data?.data);
				setUserFilters(FeHelpers.cloneDeep(response.data?.data));
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	//init data
	useEffect(() => {
		const fetchData = async () => {
			loadingService.setLoading(true);
			await getRoles();
			await getUsers();
			loadingService.setLoading(false);
		};
		fetchData();
	}, []);
	async function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getUsers();
			setOpenCreateUserDialog(false);
		} else {
			setOpenCreateUserDialog(true);
		}
	}
	function onClose() {
		setOpenCreateUserDialog(false);
		setConfirmDialog(false);
	}

	function handleButtonClick() {
		setUserDialogData({
			type: CONST.DIALOG.TYPE.ADD,
			id: null,
		});
		setOpenCreateUserDialog(true);
	}
	async function handleAddUserToRole(row) {
		try {
			const response = await UserService.addUserToRole({ user_id: row?.id, role_id: selectedRole?.id }, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Thêm quyền cho người dùng thành công");
				await getUserByRole(selectedRole?.id);
			} else {
				toast.error("Thêm quyền cho người dùng thất bại");
			}
		} catch (err) {
			toast.error("Thêm quyền cho người dùng thất bại" + err);
		}
	}
	async function handleRoleChange(data) {
		setSelectedRole(data);
		loadingService.setLoading(true);
		await getPermissionByRole(data.id);
		await getUserByRole(data.id);
		loadingService.setLoading(false);
	}
	function handleUserRoleChange(data) {}
	function handleRolePermissionChange(data) {
		console.log(data);
	}
	async function handleAddUserRole() {
		if (selectedRole) {
			setOpenCreateUserDialog(true);
		}
	}
	async function handleDeleteUserRole(item) {
		if (selectedRole) {
			try {
				const response = await UserService.deleteUserRole(item.id, accessToken);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa quyền tài khoản thành công");
					await getUserByRole(selectedRole?.id);
				} else {
					toast.error("Xóa quyền tài khoản thất bại");
				}
			} catch (err) {
				toast.error(err.message);
			}
		}
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<div className="row">
				<div className="col-md-4 col-6">
					<CommonListComponent
						isAdd={false}
						handleAdd={handleAddUserRole}
						handleChange={handleRoleChange}
						data={roles || []}
						title={"Quyền"}
						paramKey={"id"}
						paramValue={"name"}></CommonListComponent>
				</div>
				<div className="col-md-4 col-6">
					<CommonListComponent
						isAdd={false}
						handleAdd={handleAddUserRole}
						paramKey={"id"}
						paramValue={"permission_name"}
						handleChange={handleRolePermissionChange}
						data={rolePermissions}
						title={"Quyền truy cập"}></CommonListComponent>
				</div>
				<div className="col-md-4 col-6">
					<CommonListComponent
						isAdd={userRoles.length > 0 ? true : false}
						isDelete={true}
						handleAdd={handleAddUserRole}
						handleDelete={handleDeleteUserRole}
						paramKey={"id"}
						paramValue={"user_email"}
						data={userRoles}
						handleChange={handleUserRoleChange}
						title={"Người dùng"}></CommonListComponent>
				</div>
			</div>
			<CommonDialogComponent
				open={openCreateUserDialog}
				title={"Thêm quyền cho người dùng"}
				icon="fa-solid fa-circle-plus"
				width="70vw"
				height="60vh"
				onClose={onClose}>
				<CommonTableComponent
					columnDef={columnDef}
					dataSource={userFilters}
					onAdd={handleAddUserToRole}></CommonTableComponent>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog message="Bạn muốn xóa người dùng này?" handleClose={handleClose}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
