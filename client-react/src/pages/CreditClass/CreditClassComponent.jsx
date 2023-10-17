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
export default function CreditClass() {
	const title = "Danh sách lớp tín chỉ";
	const buttons = [
		{
			name: "Tạo lớp tín chỉ",
			onClick: handleButtonClick,
		},
	];
	const createTitle = "Tạo lớp tín chỉ";
	const loadingService = useLoadingService();
	const [openCreateCreditClassDialog, setOpenCreateCreditClassDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	function getCreditClasses() {
		loadingService.setLoading(true);
		CreditClassService.getAllCreditClass()
			.then((response) => {
				console.log(response);
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
			colName: "Năm học",
			colDef: "semester_year",
		},
		{
			colName: "Học kỳ",
			colDef: "semester_semester",
		},
		{
			colName: "Môn học",
			colDef: "subject_name",
		},
		{
			colName: "Số lượng",
			colDef: "quantity",
		},
	];

	function handleButtonClick() {
		setOpenCreateCreditClassDialog(true);
	}
	//init data
	useEffect(() => {
		console.log("call effect");
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
				width="70vw"
				height="50vh"
				onClose={onCloseCreateCreditClassForm}>
				<CreateCreditClass onSubmit={handleClose} />
			</CommonDialogComponent>
		</Box>
	);
}
