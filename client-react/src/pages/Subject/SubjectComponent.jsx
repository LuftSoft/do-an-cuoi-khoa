import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";
import { SubjectService } from "./SubjectService";
import styled from "@emotion/styled";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { CreateSubjectComponent } from ".";
import { toast } from "react-toastify";
import { CONST } from "../../utils/const";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { TestService } from "../Test/TestService";
import { selectAccessToken } from "../../redux/selectors";

export default function SubjectComponent() {
	const title = "Danh sách môn học";
	const buttons = [
		{
			name: "Tạo môn học",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [deleteSubjectId, setDeleteSubjectId] = useState(null);
	const [openCreateSubjectDialog, setOpenCreateSubjectDialog] = useState(false);
	const accessToken = useSelector(selectAccessToken);
	const [detailSubjectDialogData, setDetailSubjectDialogData] = useState({
		type: "add",
		id: null,
	});
	function getSubjects() {
		SubjectService.getAllSubject()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setDataSource(response.data?.data);
				} else {
					toast.error(response.data?.message);
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
	}
	const listSubjectState = useQuery({
		queryKey: ["subject"],
		queryFn: async () => {
			try {
				loadingService.setLoading(true);
				const res = await SubjectService.getAllSubject();
				loadingService.setLoading(false);
				return res;
			} catch (error) {
				console.log(error);
				return Promise.reject(error);
			}
		},
	});
	function handleClose(data) {
		if (data.data.code === "SUCCESS") {
			getSubjects();
			setOpenCreateSubjectDialog(false);
		} else {
			setOpenCreateSubjectDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateSubjectDialog(false);
	}
	const columnDef = [
		{
			colName: "Tên môn học",
			colDef: "name",
		},
		{
			colName: "Khoa",
			colDef: "department_name",
		},
		{
			colName: "Số tín chỉ",
			colDef: "credit",
		},
		{
			colName: "Số tiết lý thuyết",
			colDef: "theoretical_lesson",
		},
		{
			colName: "Số tiết thực hành",
			colDef: "pratical_lesson",
		},
	];

	const [dataSource, setDataSource] = useState([]);
	useEffect(() => {
		getSubjects();
	}, []);
	function handleButtonClick() {
		setDetailSubjectDialogData({
			type: "add",
			id: null,
		});
		setOpenCreateSubjectDialog(true);
	}
	async function handleEdit(row) {
		setDetailSubjectDialogData({
			type: "edit",
			id: row.id,
		});
		setOpenCreateSubjectDialog(true);
	}
	async function handleDelete(row) {
		setConfirmDialog(true);
		setDeleteSubjectId(row.id);
	}
	async function handleCloseConfirmDialog(data) {
		console.log("close", data);
		if (data) {
			try {
				loadingService.setLoading(true);
				const response = await SubjectService.deleteSubject(deleteSubjectId, accessToken);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa môn học thành công");
					getSubjects();
				} else {
					toast.error("Môn học đã có chương, không thể xóa");
				}
				loadingService.setLoading(false);
			} catch (err) {
				toast.error("Môn học đã có chương, không thể xóa");
				loadingService.setLoading(false);
			}
		}
		setConfirmDialog(false);
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
				onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateSubjectDialog}
				title={detailSubjectDialogData.type === "add" ? "Tạo môn học" : "Chỉnh sửa môn học"}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<CreateSubjectComponent onSubmit={handleClose} data={detailSubjectDialogData} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleCloseConfirmDialog}>
				<ConfirmDialog message="Bạn muốn xóa môn học này?" handleClose={handleCloseConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
