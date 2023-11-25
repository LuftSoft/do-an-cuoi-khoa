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
export default function UserComponent() {
	const title = "Danh sách tài khoản";
	const buttons = [
		{
			name: "Thêm tài khoản",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [userDialogData, setUserDialogData] = useState({
		type: CONST.DIALOG.TYPE.ADD,
		id: null,
	});
	const accessToken = useSelector(selectAccessToken);
	function getUsers() {
		loadingService.setLoading(true);
		UserService.getAllUser()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					response.data?.data.forEach((user) => {
						user.full_name = `${user.firstName} ${user.lastName}`;
						user.dateOfBirth = user.dateOfBirth.substring(0, 10);
						user.gender_translate = FeHelpers.translateGender(user.gender);
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
						user.avatar = `<img class="avatar-small" src="data:image/png;base64,${user.avatar}" alt="avatar" />`;
					});
					setDataSource(response.data?.data);
				} else {
					toast.error("Tải danh sách tài khoản thất bại");
				}
			})
			.catch((err) => {
				toast.error("Tải danh sách tài khoản thất bại");
				console.log(err);
			});
		loadingService.setLoading(false);
	}
	//init data
	useEffect(() => {
		getUsers();
	}, []);
	function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			getUsers();
			setOpenCreateUserDialog(false);
		} else {
			setOpenCreateUserDialog(true);
		}
	}
	function onClose() {
		setOpenCreateUserDialog(false);
		setConfirmDialog(false);
	}
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

	function handleButtonClick() {
		setUserDialogData({
			type: CONST.DIALOG.TYPE.ADD,
			id: null,
		});
		setOpenCreateUserDialog(true);
	}
	function handleEdit(row) {
		setUserDialogData({
			type: CONST.DIALOG.TYPE.EDIT,
			id: row.id,
		});
		setOpenCreateUserDialog(true);
	}
	function handleDelete(row) {
		setDeleteId(row.id);
		setConfirmDialog(true);
	}
	async function handleConfirmDialog(value) {
		setConfirmDialog(false);
		if (value) {
			await deleteUser(deleteId).finally(getUsers());
		}
	}
	async function deleteUser(id) {
		try {
			loadingService.setLoading(true);
			const response = await UserService.deleteUser(id, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Xóa tài khoản thành công");
				loadingService.setLoading(false);
			} else {
				toast.error("Xóa tài khoản thất bại");
				loadingService.setLoading(false);
			}
		} catch (err) {
			toast.error(err.message);
			loadingService.setLoading(false);
		}
	}
	function getDialogTitle() {
		let title = "";
		switch (type) {
			case CONST.DIALOG.TYPE.CREATE:
				title = "Tạo tài khoản";
				break;
			case CONST.DIALOG.TYPE.VIEW:
				title = "Chi tiết tài khoản";
				break;
			case CONST.DIALOG.TYPE.EDIT:
				title = "Chỉnh sửa tài khoản";
				break;
		}
		return title;
	}

	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}
				onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateUserDialog}
				title={getDialogTitle()}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onClose}>
				<CreateUserComponent data={userDialogData} onSubmit={handleClose} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog message="Bạn muốn xóa người dùng này?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
