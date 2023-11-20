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
import ImportDialogComponent from "../Question/ImportComponent";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
export default function CreditClassComponent() {
	const title = "Danh sách lớp tín chỉ";
	const buttons = [
		{
			icon: "fa-solid fa-plus",
			name: "Tạo lớp tín chỉ",
			onClick: handleButtonClick,
		},
	];
	const actions = [{ name: "", icon: "", onClick: "" }];
	const createTitle = "Tạo lớp tín chỉ";
	const loadingService = useLoadingService();
	const [openCreateCreditClassDialog, setOpenCreateCreditClassDialog] = useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
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
	async function handleDelete(row) {
		setOpenConfirmDialog(true);
	}
	//init data
	useEffect(() => {
		getCreditClasses();
	}, []);
	function handleCloseConfirmQuestion() {
		setOpenConfirmDialog(false);
	}
	async function handleConfirmDialog(data) {
		if (data) {
			try {
				console.log(row);
				const response = await CreditClassService.deleteCreditClass(row?.id);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa lớp tín thành công");
				} else {
					toast.error("Lớp tín chỉ đã được sử dụng, không thể xóa");
				}
			} catch (err) {
				toast.error("Lớp tín chỉ đã được sử dụng, không thể xóa");
			}
		}
		setOpenConfirmDialog(false);
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateCreditClassDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onCloseCreateCreditClassForm}>
				<CreateCreditClass onSubmit={handleClose} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openConfirmDialog}
				title="Xác nhận"
				message="Xác nhận xóa lớp tín chỉ"
				icon="fa-solid fa-triangle-exclamation"
				width="30vw"
				height="50vh"
				onClose={handleConfirmDialog}>
				<ConfirmDialog message="Xác nhận xóa lớp tín chỉ" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
