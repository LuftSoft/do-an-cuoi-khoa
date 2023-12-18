import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { selectUser } from "../../redux/selectors";
import { FeHelpers } from "../../utils/helpers";
export default function AssignClassComponent() {
	const title = "Phân công giảng viên";
	const buttons = [
		{
			icon: "fa-solid fa-plus",
			name: "Tạo lớp tín chỉ",
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
	const actionGV = [
		{
			name: "Danh sách lớp",
			variant: "contained",
			onClick: handleClassDetail,
		},
	];
	const createTitle = "Phân công giảng viên";
	const { loading, setLoading } = useLoadingService();
	const [openAssignCreditClassDialog, setopenAssignCreditClassDialog] = useState(false);
	const [openCreditClassDetailDialog, setOpenCreditClassDetailDialog] = useState(false);
	const [openCreateCreditClassDialog, setOpenCreateCreditClassDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [creditClass, setCreditClass] = useState({});
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
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
		setopenAssignCreditClassDialog(true);
	}
	function handleClassDetail(data) {
		if (data) setCreditClass(data);
		setOpenCreditClassDetailDialog(true);
	}
	function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			getCreditClasses();
			setopenAssignCreditClassDialog(false);
		} else {
			setopenAssignCreditClassDialog(true);
		}
	}
	function onCloseCreateCreditClassForm() {
		setopenAssignCreditClassDialog(false);
	}
	function onCloseCreditClassDetailForm() {
		setOpenCreditClassDetailDialog(false);
	}
	const columnDef = [
		{
			colName: "Mã lớp tín chỉ",
			colDef: "class_code",
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
			colDef: "name",
		},
		{
			colName: "Môn học",
			colDef: "subject_name",
		},
	];

	function handleButtonClick() {
		setOpenCreateCreditClassDialog(true);
	}
	function handleCloseCreateCreditClasses() {
		setOpenCreateCreditClassDialog(false);
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={HAS_ADMIN_PERMISSION ? buttons : []} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				actions={HAS_ADMIN_PERMISSION ? actions : actionGV}></CommonTableComponent>
			<CommonDialogComponent
				open={openAssignCreditClassDialog}
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
			<CommonDialogComponent
				open={openCreateCreditClassDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={handleCloseCreateCreditClasses}>
				<CreateCreditClass onSubmit={handleCloseCreateCreditClasses} />
			</CommonDialogComponent>
		</Box>
	);
}
