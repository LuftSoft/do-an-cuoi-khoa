import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateChapterComponent, CreateSubjectComponent } from ".";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { useLoadingService } from "../../contexts/loadingContext";
import { SubjectService } from "./SubjectService";
import CreateChapter from "./CreateChapterComponent";

export default function ChapterComponent() {
	const title = "Danh sách môn học";
	const createTitle = "Tạo chương";
	const buttons = [
		{
			name: "Tạo chương",
			onClick: handleButtonClick,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateChapterDialog, setOpenCreateChapterDialog] = useState(false);
	const listSubjectState = useQuery({
		queryKey: ["subject"],
		queryFn: async () => {
			try {
				loadingService.setLoading(true);
				const res = await SubjectService.getAllChapter();
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
			setOpenCreateChapterDialog(false);
		} else {
			setOpenCreateChapterDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateChapterDialog(false);
	}
	const columnDef = [
		{
			colName: "Tên chương",
			colDef: "name",
		},
		{
			colName: "Môn học",
			colDef: "credit",
		},
		{
			colName: "Chương số",
			colDef: "theoretical_lesson",
		},
	];

	var dataSource = [];
	if (listSubjectState?.data?.data && listSubjectState?.isSuccess) {
		dataSource = listSubjectState.data.data.data;
	}
	function handleButtonClick() {
		setOpenCreateChapterDialog(true);
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource}></CommonTableComponent>
			<CommonDialogComponent open={openCreateChapterDialog} title={createTitle} onClose={onCloseCreateSubjectForm}>
				<CreateChapterComponent onSubmit={handleClose} />
			</CommonDialogComponent>
		</Box>
	);
}
