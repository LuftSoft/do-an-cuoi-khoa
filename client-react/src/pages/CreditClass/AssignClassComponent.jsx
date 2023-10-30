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
import CreditClassDetailComponent from "./CreditClassDetailComponent";
export default function AssignClassComponent() {
	const title = "Phân công giảng viên";
	const buttons = [
		{
			name: "Phân công giảng dạy",
			onClick: handleButtonClick,
		},
	];
	const actions = [
		{
			name: "Phân công giảng dạy",
			variant: "contained",
			onClick: handleClassAssign,
		},
		{
			name: "Danh sách lớp",
			variant: "contained",
			onClick: handleClassDetail,
		},
	];
	const createTitle = "Phân công giảng viên";
	const { loading, setLoading } = useLoadingService();
	const [openCreateCreditClassDialog, setOpenCreateCreditClassDialog] = useState(false);
	const [openCreditClassDetailDialog, setOpenCreditClassDetailDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [creditClass, setCreditClass] = useState({});
	function getCreditClasses() {
		setLoading(true);
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
			})
			.finally(() => {
				setLoading(false);
			});
	}
	//init data
	useEffect(() => {
		getCreditClasses();
	}, []);
	function handleClassAssign(data) {
		if (data) setCreditClass(data);
		setOpenCreateCreditClassDialog(true);
	}
	function handleClassDetail(data) {
		if (data) setCreditClass(data);
		setOpenCreditClassDetailDialog(true);
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
	function onCloseCreditClassDetailForm() {
		setOpenCreditClassDetailDialog(false);
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
	const handleEdit = (data) => {
		if (data) setCreditClass(data);
		setOpenCreateCreditClassDialog(true);
	};
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onEdit={handleEdit}
				actions={actions}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateCreditClassDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="60vw"
				height="50vh"
				onClose={onCloseCreateCreditClassForm}>
				<CreateAssignComponent onSubmit={handleClose} data={creditClass} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openCreditClassDetailDialog}
				title="Danh sách lớp"
				icon="fa-solid fa-circle-plus"
				width="60vw"
				height="50vh"
				onClose={onCloseCreditClassDetailForm}>
				<CreditClassDetailComponent onSubmit={handleClose} data={creditClass} />
			</CommonDialogComponent>
		</Box>
	);
}
