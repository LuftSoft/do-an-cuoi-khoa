import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CreateChapterComponent, CreateSubjectComponent } from ".";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { useLoadingService } from "../../contexts/loadingContext";
import { SubjectService } from "./SubjectService";
import CreateChapter from "./CreateChapterComponent";
import { CONST } from "../../utils/const";

export default function ChapterComponent() {
	const title = "Danh sách môn học";
	const createTitle = "Tạo chương";
	const buttons = [
		{
			name: "Tạo chương",
			onClick: handleButtonClick,
		},
	];
	const { loading, setLoading } = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateChapterDialog, setOpenCreateChapterDialog] = useState(false);
	function getChapters() {
		setLoading(true);
		SubjectService.getAllChapter()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					const data = response.data?.data ? response.data?.data : [];
					setDataSource(data);
				}
			})
			.catch((err) => console.log(err));
		setLoading(false);
	}
	function handleClose(data) {
		if (data.data.code === "SUCCESS") {
			setOpenCreateChapterDialog(false);
			getChapters();
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
			colDef: "subject_name",
		},
		{
			colName: "Chương số",
			colDef: "index",
		},
	];

	var [dataSource, setDataSource] = useState([]);
	useEffect(() => {
		getChapters();
	}, []);
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
