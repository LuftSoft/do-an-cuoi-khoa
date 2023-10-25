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
export default function UserComponent() {
	console.log("cc sao ko render vao dayy");
	const title = "Danh sách tài khoản";
	const buttons = [
		{
			name: "Thêm tài khoản",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateUserDialog, setopenCreateUserDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const [question, setQuestion] = useState({});
	const accessToken = useSelector(selectAccessToken);
	function getUsers() {
		loadingService.setLoading(true);
		UserService.getAllUser()
			.then((response) => {
				console.log(response);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					response.data?.data.forEach((user) => {
						user.full_name = `${user.firstName} ${user.lastName}`;
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
			setopenCreateUserDialog(false);
		} else {
			setopenCreateUserDialog(true);
		}
	}
	function onClose() {
		setopenCreateUserDialog(false);
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
			colName: "Hình ảnh",
			colDef: "avatar",
		},
		{
			colName: "Giới tính",
			colDef: "gender",
		},
		{
			colName: "Ngày sinh",
			colDef: "age",
		},
	];

	function handleButtonClick() {
		setType(CONST.DIALOG.TYPE.CREATE);
		setopenCreateUserDialog(true);
	}
	function handleView(question) {
		setQuestion(question);
		setType(CONST.DIALOG.TYPE.VIEW);
		setopenCreateUserDialog(true);
	}
	function handleEdit(question) {
		setQuestion(question);
		setType(CONST.DIALOG.TYPE.EDIT);
		setopenCreateUserDialog(true);
	}
	function handleDelete(question) {
		setDeleteId(question.id);
		setConfirmDialog(true);
	}
	function handleConfirmDialog(value) {
		setConfirmDialog(false);
		if (value) {
			deleteUser(deleteId);
		}
	}
	function deleteUser(id) {
		loadingService.setLoading(true);
		QuestionService.deleteUser(id, accessToken)
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa tài khoản thành công");
				} else {
					toast.error(response.data?.message);
				}
				loadingService.setLoading(false);
			})
			.catch((err) => {
				loadingService.setLoading(false);
			});
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
				onView={handleView}
				onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateUserDialog}
				title={getDialogTitle()}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onClose}>
				<CreateUserComponent data={question} onSubmit={handleClose} type={type} />
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
