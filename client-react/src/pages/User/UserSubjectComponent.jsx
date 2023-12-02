import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateUserComponent, UserSubjectDetailComponent } from ".";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { selectAccessToken } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import { UserService } from "./UserService";
import { FeHelpers } from "../../utils/helpers";
export default function UserSubjectComponent() {
	const title = "Danh sách bộ câu hỏi";
	const buttons = [];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [userId, setUserId] = useState(null);
	const accessToken = useSelector(selectAccessToken);
	async function getClusters() {
		try {
			const response = await UserService.getAllCluster();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				response.data?.data.forEach((user) => {
					user.full_name = `${user.firstName} ${user.lastName}`;
					user.type_translate = FeHelpers.translateUserType(user.type);
					user.subject_names = user?.subject_names?.split(",").join(`, `);
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
	}
	//init data
	useEffect(() => {
		const fetchData = async () => {
			loadingService.setLoading(true);
			getClusters();
			loadingService.setLoading(false);
		};
		fetchData();
	}, []);
	async function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getClusters();
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
			colName: "Mã tài khoản",
			colDef: "code",
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
			colName: "Quyền môn học",
			colDef: "subject_names",
		},
	];

	function handleEdit(row) {
		setUserId(row.id);
		setOpenCreateUserDialog(true);
	}
	function handleDelete(row) {
		setDeleteId(row.id);
		setConfirmDialog(true);
	}
	async function handleConfirmDialog(value) {
		setConfirmDialog(false);
		if (value) {
			await deleteUser(deleteId);
			setTimeout(async () => {
				await getClusters();
			}, 200);
		}
	}
	async function deleteUser(id) {
		try {
			const response = await UserService.deleteUser(id, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Xóa tài khoản thành công");
			} else {
				toast.error("Xóa tài khoản thất bại");
			}
		} catch (err) {
			toast.error(err.message);
		}
	}

	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource} onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateUserDialog}
				title={"Chi tiết bộ câu hỏi"}
				icon="fa-solid fa-circle-plus"
				width="70vw"
				height="50vh"
				onClose={onClose}>
				<UserSubjectDetailComponent id={userId} />
			</CommonDialogComponent>
		</Box>
	);
}
