import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateQuestionComponent } from ".";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import CommonFilterComponent from "../../components/Common/CommonFilter/CommonFilterComponent";
import { selectAccessToken } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";
import ImportDialogComponent from "./ImportComponent";
import { QuestionService } from "./QuestionService";
import { SubjectService } from "../Subject/SubjectService";
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
			onClick: handleOpenImportQuestionDialog,
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
			onClick: handleDownLoadTemplate,
			color: CONST.BUTTON.COLOR.WARNING,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateQuestionDialog, setOpenCreateQuestionDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const questionRef = useRef([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [openImportDialog, setOpenImportDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const [question, setQuestion] = useState({});
	const [commonFilter, setCommonFilter] = useState({
		search: {
			title: "Tìm kiếm câu hỏi",
			handleChange: handleSearchQuestion,
		},
		dropdowns: {
			subjectFilter: {
				placeholder: "Môn học",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleSubjectFilterChange,
			},
			levelFilter: {
				placeholder: "Độ khó",
				value: "",
				options: [
					{ key: "Tất cả", value: "ALL" },
					{ key: "Dễ", value: "EASY" },
					{ key: "Vừa", value: "MEDIUM" },
					{ key: "Khó", value: "DIFFICULT" },
				],
				handleChange: handleLevelFilterChange,
			},
		},
	});
	let commonFilterValue = useRef({
		search: "",
		subject: "",
		level: "",
	});
	const accessToken = useSelector(selectAccessToken);
	const levelEasyVN = "DỄ";
	const levellevelMediumVN = "VỪA";
	const leveleveDifficultVN = "KHÓ";
	function getSubjects() {
		console.log("get subject");
		SubjectService.getAllSubject()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					let opts = commonFilter.dropdowns;
					let sjOpts = opts?.subjectFilter?.options;
					sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
					response.data?.data?.forEach((item) => {
						sjOpts.push({ key: item.name, value: item.id });
					});
					opts.subjectFilter.options = sjOpts;
					setCommonFilter({ ...commonFilter, dropdowns: opts });
				} else {
					toast.error(response.data?.message);
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
	}
	function getQuestions() {
		loadingService.setLoading(true);
		QuestionService.getAllQuestion(accessToken)
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					let data = response.data?.data;
					//set style for level
					data.forEach((item) => {
						item.className = {};
						switch (item?.level) {
							case CONST.QUESTION.LEVEL[0]:
								item.level = levelEasyVN;
								item.className.level = "bg-easy";
								break;
							case CONST.QUESTION.LEVEL[1]:
								item.level = levellevelMediumVN;
								item.className.level = "bg-medium";
								break;
							case CONST.QUESTION.LEVEL[2]:
								item.level = leveleveDifficultVN;
								item.className.level = "bg-difficult";
								break;
						}
					});
					questionRef.current = FeHelpers.cloneDeep(response.data?.data);
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
		getSubjects();
	}, []);
	async function handleExportQuestion() {
		loadingService.setLoading(true);
		try {
			const response = await QuestionService.exportQuestion(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const pdfBuffer = atob(response.data?.data);
				const byteNumbers = new Array(pdfBuffer.length);
				for (let i = 0; i < pdfBuffer.length; i++) {
					byteNumbers[i] = pdfBuffer.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);
				const blob = new Blob([byteArray], { type: "application/pdf" });

				// Create a download link
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = `question_import_result_${new Date().getTime()}.xlsx`;
				document.body.appendChild(link);

				// Trigger the download
				link.click();

				// Clean up
				document.body.removeChild(link);
				toast.success("Export câu hỏi thành công");
			}
			loadingService.setLoading(false);
		} catch (err) {
			toast.error("Export câu hỏi thất bại");
			loadingService.setLoading(false);
		}
	}
	function handleOpenImportQuestionDialog() {
		setOpenImportDialog(true);
	}
	async function handleImportQuestion(file) {
		console.log(file.name);
		console.log("handle import dialog");
		const response = await QuestionService.importQuestion({ file: file }, accessToken);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			const pdfBuffer = atob(response.data?.data);
			const byteNumbers = new Array(pdfBuffer.length);
			for (let i = 0; i < pdfBuffer.length; i++) {
				byteNumbers[i] = pdfBuffer.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: "application/pdf" });

			// Create a download link
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `question_import_result_${new Date().getTime()}.xlsx`;
			document.body.appendChild(link);

			// Trigger the download
			link.click();

			// Clean up
			document.body.removeChild(link);
			toast.success(`Import câu hỏi thành công`);
			setOpenImportDialog(false);
		}
	}
	function handleCloseImportQuestion() {
		setOpenImportDialog(false);
	}
	async function handleDownLoadTemplate() {
		//create object to save
		const link = document.createElement("a");
		link.href = CONST.SELF_URL + "/public/file/question_import_template.xlsx";
		link.setAttribute("download", `question_template_import_${new Date().getTime()}.xlsx`);

		document.body.appendChild(link);
		link.click();

		//clean up
		document.body.removeChild(link);
	}

	//filter
	useEffect(() => {
		console.log("commonFasdasdilterValue", commonFilterValue);
		loadingService.setLoading(true);
		let questionsTmp = FeHelpers.cloneDeep(questionRef.current);
		try {
			let searchRef = commonFilterValue.current.search;
			let subjectRef = commonFilterValue.current.subject;
			let levelRef = commonFilterValue.current.level;
			if (searchRef !== null && searchRef.length > 0) {
				questionsTmp = questionsTmp.filter(
					(item) =>
						FeHelpers.chuanhoadaucau(item.question).toLowerCase().includes(searchRef) ||
						FeHelpers.chuanhoadaucau(item.subject_name).toLowerCase().includes(searchRef),
				);
			}
			if (subjectRef !== null && subjectRef.length > 0) {
				questionsTmp = questionsTmp.filter((item) => item.subject_id === subjectRef);
			}
			if (levelRef !== null && levelRef.length > 0) {
				questionsTmp = questionsTmp.filter((item) => item.level === levelRef);
			}
			setDataSource(questionsTmp);
		} catch (err) {
			console.log("err when filter", err);
		}
		setTimeout(() => {
			loadingService.setLoading(false);
		}, 500);
	}, [commonFilterValue]);
	const handleFilter = () => {
		console.log("commonFasdasdilterValue", commonFilterValue);
		loadingService.setLoading(true);
		let questionsTmp = FeHelpers.cloneDeep(questionRef.current);
		try {
			let searchRef = commonFilterValue.current.search;
			let subjectRef = commonFilterValue.current.subject;
			let levelRef = commonFilterValue.current.level;
			if (searchRef !== null && searchRef.length > 0) {
				questionsTmp = questionsTmp.filter(
					(item) =>
						FeHelpers.chuanhoadaucau(item.question).toLowerCase().includes(searchRef) ||
						FeHelpers.chuanhoadaucau(item.subject_name).toLowerCase().includes(searchRef),
				);
			}
			if (subjectRef !== null && subjectRef.length > 0) {
				questionsTmp = questionsTmp.filter((item) => item.subject_id === subjectRef);
			}
			if (levelRef !== null && levelRef.length > 0) {
				questionsTmp = questionsTmp.filter((item) => item.level === levelRef);
			}
			setDataSource(questionsTmp);
		} catch (err) {
			console.log("err when filter", err);
		}
		setTimeout(() => {
			loadingService.setLoading(false);
		}, 500);
	};
	function handleSearchQuestion(key) {
		commonFilterValue.current.search = FeHelpers.chuanhoadaucau(key)?.trim().toLowerCase();
		handleFilter();
	}
	function handleSubjectFilterChange(id) {
		commonFilterValue.current.subject = id;
		handleFilter();
	}
	function handleLevelFilterChange(level) {
		console.log(commonFilterValue.current);
		let levelTmp = "";
		switch (level) {
			case "EASY":
				levelTmp = levelEasyVN;
				break;
			case "MEDIUM":
				levelTmp = levellevelMediumVN;
				break;
			case "DIFFICULT":
				levelTmp = leveleveDifficultVN;
				break;
			default:
				levelTmp = "";
				break;
		}
		commonFilterValue.current.level = levelTmp;
		handleFilter();
	}

	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
				<CommonFilterComponent search={commonFilter.search} dropdowns={commonFilter.dropdowns}></CommonFilterComponent>
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
				<ImportDialogComponent
					handleClose={handleCloseImportQuestion}
					handleSubmit={handleImportQuestion}></ImportDialogComponent>
			</CommonDialogComponent>
		</Box>
	);
}
