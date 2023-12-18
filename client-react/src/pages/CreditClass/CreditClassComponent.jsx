import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import CreateCreditClass from "./CreateCreditClassComponent";
import { CONST, RESPONSE_MESSAGE } from "../../utils/const";
import { QuestionService } from "../Question/QuestionService";
import { CreditClassService } from "./CreditClassService";
import ImportDialogComponent from "../Question/ImportComponent";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { FeHelpers } from "../../utils/helpers";
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
	const [idToDelete, setIdToDelete] = useState(null);
	const accessToken = useSelector(selectAccessToken);
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	async function getCreditClasses() {
		try {
			const response = await CreditClassService.getAllCreditClassByUserId(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setDataSource(response.data?.data);
			} else {
				toast.error("Không tìm thấy lớp tín chỉ.");
			}
		} catch (err) {
			console.log("get all credit class failed, error: ", err);
			toast.error("Không tìm thấy lớp tín chỉ.");
		}
	}
	async function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getCreditClasses();
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
			colName: "Mã lớp tín chỉ",
			colDef: "class_code",
		},
		{
			colName: "Lớp tín chỉ",
			colDef: "name",
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
		setIdToDelete(row.id);
		setOpenConfirmDialog(true);
	}
	//init data
	const getInitData = async () => {
		loadingService.setLoading(true);
		await getCreditClasses();
		loadingService.setLoading(false);
	};
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	function handleCloseConfirmQuestion() {
		setOpenConfirmDialog(false);
	}
	async function handleConfirmDialog(data) {
		if (data) {
			try {
				const response = await CreditClassService.deleteCreditClass(idToDelete);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success(RESPONSE_MESSAGE.CREDIT_CLASS.DELETE_SUCCESS);
					await getCreditClasses();
				} else {
					toast.error(RESPONSE_MESSAGE.CREDIT_CLASS.DELETE_FAILED);
				}
			} catch (err) {
				console.log(err);
				toast.error(RESPONSE_MESSAGE.CREDIT_CLASS.DELETE_FAILED);
			}
		}
		setOpenConfirmDialog(false);
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={HAS_ADMIN_PERMISSION ? buttons : []} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={HAS_ADMIN_PERMISSION ? handleDelete : null}></CommonTableComponent>
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
