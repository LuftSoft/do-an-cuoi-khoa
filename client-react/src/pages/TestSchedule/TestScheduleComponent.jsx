import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateTestScheduleComponent } from ".";
import { CONST } from "../../utils/const";
import { QuestionService } from "../Question/QuestionService";
import "./TestSchedule.css";
import { TestScheduleService } from "./TetsScheduleService";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
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
	const [confirmDialog, setConfirmDialog] = useState(false);
	function getTestSchedules() {
		loadingService.setLoading(true);
		TestScheduleService.getAllTestSchedule()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					const data = response.data?.data;
					setDataSource(data);
				} else {
					toast.error("Không tìm thấy ca thi.");
				}
			})
			.catch((err) => {
				console.log("get all question failed, error: ", err);
				toast.error("Không tìm thấy ca thi.");
			});
		loadingService.setLoading(false);
	}
	function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			getTestSchedules();
			setOpenCreateTestScheduleDialog(false);
		} else {
			setOpenCreateTestScheduleDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateTestScheduleDialog(false);
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
	];

	function handleButtonClick() {
		setOpenCreateTestScheduleDialog(true);
		console.log("is clicked");
	}
	//init data
	useEffect(() => {
		getTestSchedules();
	}, []);
	function handleDelete() {
		setConfirmDialog(true);
	}
	function handleConfirmDialog(value) {
		if (value) {
		}
		setConfirmDialog(false);
	}
	function handleView(param) {}
	function handleEdit(param) {}
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
				open={openCreateTestScheduleDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<CreateTestScheduleComponent onSubmit={handleClose} />
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
