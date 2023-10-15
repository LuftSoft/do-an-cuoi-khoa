import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import styled from "@emotion/styled";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { SubjectService } from "../Subject/SubjectService";
import { CreateSubjectComponent } from "../Subject";
import { CreateQuestionComponent } from ".";
import { QuestionService } from "./QuestionService";
export default function QuestionComponent() {
	const title = "Danh sách câu hỏi";
	const buttons = [
		{
			name: "Tạo câu hỏi",
			onClick: handleButtonClick,
		},
	];
	const createTitle = "Tạo câu hỏi";
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateQuestionDialog, setOpenCreateQuestionDialog] = useState(false);
	const listQuestionState = useQuery({
		queryKey: ["subject"],
		queryFn: async () => {
			try {
				loadingService.setLoading(true);
				const res = await QuestionService.getAllQuestion();
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
			setOpenCreateQuestionDialog(false);
		} else {
			setOpenCreateQuestionDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateQuestionDialog(false);
	}
	const columnDef = [
		{
			colName: "Nội dung",
			colDef: "name",
		},
		{
			colName: "Môn học",
			colDef: "subject",
		},
		{
			colName: "Chương",
			colDef: "chapter",
		},
		{
			colName: "Độ khó",
			colDef: "level",
		},
	];

	var dataSource = [];
	if (listQuestionState?.data?.data && listQuestionState?.isSuccess) {
		dataSource = listQuestionState.data.data.data;
	}
	function handleButtonClick() {
		setOpenCreateQuestionDialog(true);
		console.log("is clicked");
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateQuestionDialog}
				title={createTitle}
				icon="fa-solid fa-circle-plus"
				width="70vw"
				height="50vh"
				onClose={onCloseCreateSubjectForm}>
				<CreateQuestionComponent onSubmit={handleClose} />
			</CommonDialogComponent>
		</Box>
	);
}