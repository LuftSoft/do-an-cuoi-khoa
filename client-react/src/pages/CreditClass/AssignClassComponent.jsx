import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import CreateCreditClass from "./CreateCreditClassComponent";
import { CONST } from "../../utils/const";
import { QuestionService } from "../Question/QuestionService";
import { CreditClassService } from "./CreditClassService";
import CreateAssignComponent from "./CreateAssignComponent";
export default function AssignClassComponent() {
	const title = "Danh sách lớp tín chỉ";
	const buttons = [
		{
			name: "Phân công",
			onClick: handleButtonClick,
		},
	];
	const createTitle = "Phân công giảng viên";
	const loadingService = useLoadingService();
	const [openCreateCreditClassDialog, setOpenCreateCreditClassDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	function getCreditClasses() {
		loadingService.setLoading(true);
		CreditClassService.getAllCreditClass()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setDataSource(response.data?.data);
				} else {
					toast.error("Không tìm thấy lớp tín chỉ.");
				}
			})
			.catch((err) => {
				console.log("get all credit class failed, error: ", err);
				toast.error("Không tìm thấy lớp tín chỉ.");
			});
		loadingService.setLoading(false);
	}
	function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			getCreditClasses();
			setOpenCreateCreditClassDialog(false);
		} else {
			setOpenCreateCreditClassDialog(true);
		}
	}
	function onCloseCreateCreditClassForm() {
		setOpenCreateCreditClassDialog(false);
	}
	const columnDef = [
		{
			colName: "Tên giảng viên",
			colDef: "user_namme",
		},
		{
			colName: "Năm học",
			colDef: "semester_year",
		},
		{
			colName: "Học kỳ",
			colDef: "semester_semester",
		},
		{
			colName: "Lớp tín chỉ",
			colDef: "credit_class_name",
		},
		{
			colName: "Môn học",
			colDef: "subject_name",
		},
	];

	function handleButtonClick() {
		setOpenCreateCreditClassDialog(true);
	}
	//init data
	useEffect(() => {
		getCreditClasses();
	}, []);
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateCreditClassDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onCloseCreateCreditClassForm}>
				<CreateAssignComponent onSubmit={handleClose} />
			</CommonDialogComponent>
		</Box>
	);
}
