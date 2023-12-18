import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateTestScheduleComponent } from ".";
import { CONST, RESPONSE_MESSAGE } from "../../utils/const";
import { QuestionService } from "../Question/QuestionService";
import "./TestSchedule.css";
import { TestScheduleService } from "./TetsScheduleService";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import dayjs from "dayjs";
import EditTestScheduleComponent from "./EditTestScheduleComponent";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import { FeHelpers } from "../../utils/helpers";
export default function TestScheduleComponent() {
	const title = "Lịch thi ";
	const buttons = [
		{
			name: "Tạo ca thi",
			onClick: handleButtonClick,
		},
	];
	const createTitle = "Tạo ca thi";
	const loadingService = useLoadingService();
	const [openCreateTestScheduleDialog, setOpenCreateTestScheduleDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [openEditTestScheduleDialog, setOpenEditTestScheduleDialog] = useState(false);
	const [editTestScheduleData, setEditTestScheduleData] = useState(null);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteTestScheduleId, setDeleteTestScheduleId] = useState(null);
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	async function getTestSchedules() {
		try {
			const response = await TestScheduleService.getAllTestSchedule();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const data = response.data?.data;
				data.forEach((item) => (item.date = dayjs(item.date).format("HH:mm:ss DD-MM-YYYY")));
				setDataSource(data);
			} else {
				toast.error("Không tìm thấy ca thi.");
			}
		} catch (err) {
			console.log("get all question failed, error: ", err);
			toast.error("Không tìm thấy ca thi.");
		}
	}
	async function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getTestSchedules();
			setOpenEditTestScheduleDialog(false);
		} else {
			setOpenEditTestScheduleDialog(true);
		}
	}

	async function handleCreateClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getTestSchedules();
			setOpenCreateTestScheduleDialog(false);
		} else {
			setOpenCreateTestScheduleDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateTestScheduleDialog(false);
		setOpenEditTestScheduleDialog(false);
		setConfirmDialog(false);
	}
	const columnDef = [
		{
			colName: "Năm học",
			colDef: "year",
		},
		{
			colName: "Học kỳ",
			colDef: "semester",
		},
		{
			colName: "Tên ca thi",
			colDef: "name",
		},
		{
			colName: "Thời gian bắt đầu",
			colDef: "date",
		},
		{
			colName: "Số bài thi",
			colDef: "quantity",
		},
	];

	function handleButtonClick() {
		setOpenCreateTestScheduleDialog(true);
		console.log("is clicked");
	}
	//init data
	const getInitData = async () => {
		loadingService.setLoading(true);
		await getTestSchedules();
		loadingService.setLoading(false);
	};
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	function handleDelete(row) {
		if (row.quantity > 0) {
			toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.UPDATE_FAILED);
			return;
		}
		setDeleteTestScheduleId(row?.id);
		setConfirmDialog(true);
	}
	async function handleConfirmDialog(value) {
		if (value) {
			try {
				const response = await TestScheduleService.deleteTestSchedule(deleteTestScheduleId);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success(RESPONSE_MESSAGE.TEST_SCHEDULE.DELETE_SUCCESS);
					await getInitData();
				} else {
					toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.DELETE_FAILED);
				}
			} catch (err) {
				toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.DELETE_FAILED);
			}
		}
		setConfirmDialog(false);
	}
	const handleEdit = (row) => {
		if (row.quantity > 0) {
			toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.UPDATE_FAILED);
			return;
		}
		setEditTestScheduleData(row);
		setOpenEditTestScheduleDialog(true);
	};
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={HAS_ADMIN_PERMISSION ? handleDelete : null}
				onEdit={HAS_ADMIN_PERMISSION ? handleEdit : null}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateTestScheduleDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<CreateTestScheduleComponent onSubmit={handleCreateClose} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openEditTestScheduleDialog}
				title="Chỉnh sửa lịch thi"
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<EditTestScheduleComponent data={editTestScheduleData} onSubmit={handleClose} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<ConfirmDialog message="Bạn muốn xóa ca thi này?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
