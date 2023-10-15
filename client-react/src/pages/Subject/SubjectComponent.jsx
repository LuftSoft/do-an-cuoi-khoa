import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";
import { SubjectService } from "./SubjectService";
import styled from "@emotion/styled";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { CreateSubjectComponent } from ".";

export default function SubjectComponent() {
	const title = "Danh sách môn học";
	const buttons = [
		{
			name: "Tạo môn học",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateSubjectDialog, setOpenCreateSubjectDialog] = useState(false);
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

	var dataSource = [];
	if (listSubjectState?.data?.data && listSubjectState?.isSuccess) {
		dataSource = listSubjectState.data.data.data;
	}
	function handleButtonClick() {
		setOpenCreateSubjectDialog(true);
		console.log("is clicked");
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateSubjectDialog}
				title="Tạo môn học"
				icon="fa-solid fa-circle-plus"
				width="70vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<CreateSubjectComponent onSubmit={handleClose} />
			</CommonDialogComponent>
		</Box>
	);
}
