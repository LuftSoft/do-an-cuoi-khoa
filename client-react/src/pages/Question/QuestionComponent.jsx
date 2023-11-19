import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { selectAccessToken } from "../../redux/selectors";
import ImportDialogComponent from "./ImportComponent";
export default function QuestionComponent() {
	const title = "Danh sách câu hỏi";
	const buttons = [
		{
			name: "Tạo câu hỏi",
			icon: "fa-solid fa-plus",
			onClick: handleButtonClick,
			color: CONST.BUTTON.COLOR.PRIMARY,
		},
		{
			name: "Import",
			icon: "fa-solid fa-file-import",
			color: CONST.BUTTON.COLOR.SUCCESS,
			onClick: handleImportQuestion,
		},
		{
			name: "Export",
			icon: "fa-solid fa-file-export",
			color: CONST.BUTTON.COLOR.SUCCESS,
			onClick: handleExportQuestion,
		},
		{
			name: "Template",
			icon: "fa-solid fa-download",
			onClick: handleExportQuestion,
			color: CONST.BUTTON.COLOR.WARNING,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateQuestionDialog, setOpenCreateQuestionDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [openImportDialog, setOpenImportDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const [question, setQuestion] = useState({});
	const accessToken = useSelector(selectAccessToken);
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
					let data = response.data?.data;
					//set style for level
					data.forEach((item) => {
						item.className = {};
						switch (item?.level) {
							case CONST.QUESTION.LEVEL[0]:
								item.level = "DỄ";
								item.className.level = "bg-easy";
								break;
							case CONST.QUESTION.LEVEL[1]:
								item.level = "VỪA";
								item.className.level = "bg-medium";
								break;
							case CONST.QUESTION.LEVEL[2]:
								item.level = "KHÓ";
								item.className.level = "bg-difficult";
								break;
						}
					});
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
			getQuestions();
			setOpenCreateQuestionDialog(false);
		} else {
			setOpenCreateQuestionDialog(true);
		}
	}
	function onClose() {
		setOpenCreateQuestionDialog(false);
		setConfirmDialog(false);
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
		setType(CONST.DIALOG.TYPE.CREATE);
		setOpenCreateQuestionDialog(true);
	}
	function handleView(question) {
		setQuestion(question);
		setType(CONST.DIALOG.TYPE.VIEW);
		setOpenCreateQuestionDialog(true);
	}
	function handleEdit(question) {
		setQuestion(question);
		setType(CONST.DIALOG.TYPE.EDIT);
		setOpenCreateQuestionDialog(true);
	}
	function handleDelete(question) {
		setDeleteId(question.id);
		setConfirmDialog(true);
	}
	function handleConfirmDialog(value) {
		setConfirmDialog(false);
		if (value) {
			deleteQuestion(deleteId);
		}
	}
	function deleteQuestion(id) {
		loadingService.setLoading(true);
		QuestionService.deleteQuestion(id, accessToken)
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa câu hỏi thành công");
				} else {
					toast.error(response.data?.message);
				}
				loadingService.setLoading(false);
			})
			.catch((err) => {
				loadingService.setLoading(false);
			});
	}
	function getDialogTitle() {
		let title = "";
		switch (type) {
			case CONST.DIALOG.TYPE.CREATE:
				title = "Tạo câu hỏi";
				break;
			case CONST.DIALOG.TYPE.VIEW:
				title = "Chi tiết câu hỏi";
				break;
			case CONST.DIALOG.TYPE.EDIT:
				title = "Chỉnh sửa câu hỏi";
				break;
		}
		return title;
	}
	//init data
	useEffect(() => {
		getQuestions();
	}, []);
	function handleExportQuestion() {}
	function handleImportQuestion() {
		setOpenImportDialog(true);
	}
	function handleCloseImportQuestion() {
		setOpenImportDialog(false);
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
				<input type="file" style={{ display: "none" }} name="import_question" />
				<input type="file" style={{ display: "none" }} name="export_question" />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}
				onView={handleView}
				onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateQuestionDialog}
				title={getDialogTitle()}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onClose}>
				<CreateQuestionComponent data={question} onSubmit={handleClose} type={type} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog message="Bạn muốn xóa câu hỏi này?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openImportDialog}
				title="Import câu hỏi"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleCloseImportQuestion}>
				<ImportDialogComponent handleClose={handleCloseImportQuestion}></ImportDialogComponent>
			</CommonDialogComponent>
		</Box>
	);
}
