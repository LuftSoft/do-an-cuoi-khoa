import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import styled from "@emotion/styled";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { SubjectService } from "../Subject/SubjectService";
import { CreateSubjectComponent } from "../Subject";
import { CreateQuestionComponent } from ".";
import { QuestionService } from "./QuestionService";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
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
	const [dataSource, setDataSource] = useState([]);
	// const listQuestionState = useQuery({
	// 	queryKey: ["subject"],
	// 	queryFn: async () => {
	// 		try {
	// 			loadingService.setLoading(true);
	// 			const res = await QuestionService.getAllQuestion();
	// 			loadingService.setLoading(false);
	// 			return res;
	// 		} catch (error) {
	// 			console.log(error);
	// 			return Promise.reject(error);
	// 		}
	// 	},
	// });
	function getQuestions() {
		loadingService.setLoading(true);
		QuestionService.getAllQuestion()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setDataSource(response.data?.data);
				} else {
					toast.error("Không tìm thấy câu hỏi.");
				}
			})
			.catch((err) => {
				console.log("get all question failed, error: ", err);
				toast.error("Không tìm thấy câu hỏi.");
			});
		loadingService.setLoading(false);
	}
	function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
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
			colDef: "question",
		},
		{
			colName: "Môn học",
			colDef: "subject_name",
		},
		{
			colName: "Chương",
			colDef: "chapter_name",
		},
		{
			colName: "Độ khó",
			colDef: "level",
		},
	];

	function handleButtonClick() {
		setOpenCreateQuestionDialog(true);
		console.log("is clicked");
	}
	//init data
	useEffect(() => {
		console.log("call effect");
		getQuestions();
	}, []);
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
