import SearchIcon from "@mui/icons-material/Search";
import { Box, Checkbox, FormControlLabel, FormGroup, TablePagination, Typography } from "@mui/material";
import { Button, IconButton, InputBase } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import "./TestComp.css";
import { TestService } from "./TestService";

import { QuestionService } from "../Question/QuestionService";
import { FeHelpers } from "../../utils/helpers";
import { CommonDialogComponent } from "../../components/Common";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { CreateQuestionComponent } from "../Question";

export default function TestCreateDetailComponent({ test, handleSubmit }) {
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const [questions, setQuestions] = useState([]);
	const [questionFilters, setQuestionFilters] = useState([]);
	const [selectedQuestions, setSelectedQuestions] = useState([]);
	const [openCreateTestDialog, setOpenCreateTestDialog] = useState(false);
	const [openAssignTestDialog, setOpenAssignTestDialog] = useState(false);
	const [openTestDetailDialog, setOpenTestDetailDialog] = useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openCreateQuestionDialog, setOpenCreateQuestionDialog] = useState(false);
	const EASY_LEVEL = CONST.QUESTION.LEVEL[0];
	const MEDUIM_LEVEL = CONST.QUESTION.LEVEL[1];
	const DIFFICULT_LEVEL = CONST.QUESTION.LEVEL[2];
	useEffect(() => {
		test.easy_question = Number.parseInt(test?.easy_question || "0");
		test.medium_question = Number.parseInt(test?.medium_question || "0");
		test.difficult_question = Number.parseInt(test?.difficult_question || "0");
		const fetchData = async () => {
			console.log("test", test);
			await getQuestionByChapterId(test?.chapters || "");
		};
		fetchData();
	}, []);
	/**
	 *
	 */
	const getQuestionByChapterId = async (chapters) => {
		const response = await QuestionService.getQuestionByChapter(chapters);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			let tmpQuestion = response.data?.data;
			tmpQuestion = tmpQuestion.sort((a, b) => b.id - a.id);
			tmpQuestion.forEach((item) => {
				item.className = {};
				switch (item?.level) {
					case CONST.QUESTION.LEVEL[0]:
						item.levelTranslate = "DỄ";
						item.className.level = "bg-easy";
						break;
					case CONST.QUESTION.LEVEL[1]:
						item.levelTranslate = "VỪA";
						item.className.level = "bg-medium";
						break;
					case CONST.QUESTION.LEVEL[2]:
						item.levelTranslate = "KHÓ";
						item.className.level = "bg-difficult";
						break;
				}
			});
			setQuestions(tmpQuestion);
			setQuestionFilters(FeHelpers.cloneDeep(tmpQuestion.slice(0, 10)));
			console.log(tmpQuestion);
		} else {
			toast.error("Không tìm thấy câu hỏi.");
		}
	};
	function handleCreateTest() {
		setOpenCreateTestDialog(true);
	}
	async function handleCloseDialog() {
		if (openCreateTestDialog) {
			setOpenCreateTestDialog(false);
		} else if (openAssignTestDialog) {
			setOpenAssignTestDialog(false);
		} else if (openTestDetailDialog) {
			setOpenTestDetailDialog(false);
		}
	}
	function onClose() {
		setOpenConfirmDialog(false);
		setOpenCreateQuestionDialog(false);
	}
	const handleSearchChange = () => {
		console.log(handleSearchChange);
	};
	const handleSearchKeySubmit = () => {
		console.log(handleSearchChange);
	};
	const handleSearchSubmit = () => {};
	/* table */
	const DEFAULT_PAGE = CONST.PAGINATION.DEFAULT_PAGE;
	const DEFAULT_ROW_PER_PAGE = CONST.PAGINATION.DEFAULT_ROW_PER_PAGE;
	const [pages, setPages] = useState(DEFAULT_PAGE);
	const [rowsPerPages, setRowPerPages] = useState(DEFAULT_ROW_PER_PAGE);
	const DEFAULT_OPTIONS = CONST.PAGINATION.OPTIONS;
	function handlePaginationPageChange(e, value) {
		setPages(value);
		setQuestionFilters(questions.slice(value * rowsPerPages, rowsPerPages * (value + 1)));
	}
	function handlePaginationRowsPerPageChange(event) {
		const _rowPerPage = parseInt(event.target.value, DEFAULT_ROW_PER_PAGE);
		setPages(DEFAULT_PAGE);
		setRowPerPages(_rowPerPage);
		setQuestionFilters(questions.slice(DEFAULT_PAGE * _rowPerPage, _rowPerPage * (DEFAULT_PAGE + 1)));
	}
	function isQuestionChecked(id) {
		return selectedQuestions.filter((item) => item.id === id).length > 0;
	}
	function handleCheckedQuestion(question) {
		const checked = selectedQuestions.filter((item) => item.id === question.id).length > 0;
		var selectedQTmp = FeHelpers.cloneDeep(selectedQuestions);
		if (checked) {
			selectedQTmp = selectedQTmp.filter((item) => item.id !== question.id);
			setSelectedQuestions(selectedQTmp);
		} else {
			if (checkValidToAdd(question)) {
				selectedQTmp.push(question);
				setSelectedQuestions(selectedQTmp);
			}
		}
	}
	/**
	 * check if question can add to test or not.
	 * @param {*} question
	 */
	function checkValidToAdd(question) {
		switch (question.level) {
			case EASY_LEVEL:
				if (selectedQuestions?.filter((item) => item.level === EASY_LEVEL).length === test?.easy_question) {
					toast.error("Đã đủ câu hỏi dễ");
					return false;
				} else {
					return true;
				}
			case MEDUIM_LEVEL:
				if (selectedQuestions?.filter((item) => item.level === MEDUIM_LEVEL).length === test?.medium_question) {
					toast.error("Đã đủ câu hỏi vừa");
					return false;
				} else {
					return true;
				}
			case DIFFICULT_LEVEL:
				if (selectedQuestions?.filter((item) => item.level === DIFFICULT_LEVEL).length === test?.difficult_question) {
					toast.error("Đã đủ câu hỏi khó");
					return false;
				} else {
					return true;
				}
			default:
				toast.error("Không thể thêm câu hỏi");
				return false;
		}
	}
	function getCountQuestion(level) {
		switch (level) {
			case EASY_LEVEL:
				return selectedQuestions?.filter((item) => item.level === EASY_LEVEL).length;
			case MEDUIM_LEVEL:
				return selectedQuestions?.filter((item) => item.level === MEDUIM_LEVEL).length;
			case DIFFICULT_LEVEL:
				return selectedQuestions?.filter((item) => item.level === DIFFICULT_LEVEL).length;
			default:
				return 0;
		}
	}
	/* table */
	async function handleConfirmDialog(data) {
		if (data) {
			try {
				const questions = selectedQuestions.map((item) => item.id);
				const response = await TestService.createManualTest({ test: test, questions: questions }, accessToken);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Tạo đề thi thành công");
				} else {
					toast.error("Tạo đề thi thất bại");
				}
			} catch (err) {
				toast.error("Tạo đề thi thất bại");
			}
			handleSubmit();
		}
		setOpenConfirmDialog(false);
	}
	async function handleOpenCreateQuestionDialog() {
		setOpenCreateQuestionDialog(true);
	}
	async function handleCreateQuestion() {}
	async function handleSaveTestDetail() {}
	function canSaveTest() {
		return (
			selectedQuestions?.filter((item) => item.level === EASY_LEVEL).length === test?.easy_question &&
			selectedQuestions?.filter((item) => item.level === MEDUIM_LEVEL).length === test?.medium_question &&
			selectedQuestions?.filter((item) => item.level === DIFFICULT_LEVEL).length === test?.difficult_question
		);
	}
	return (
		<Box>
			<div className="row my-2" style={{ width: "100%", overflow: "hidden" }}>
				<div className="col-4" style={styles.scrollContain}>
					<div className="px-3">
						<div style={styles.commonFilter}>
							<InputBase
								sx={{ ml: 1, flex: 1 }}
								placeholder={"Tìm kiếm câu hỏi..." || "Search"}
								inputProps={{ "aria-label": "search" }}
								onChange={handleSearchChange}
								onKeyUp={handleSearchKeySubmit}
							/>
							<IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearchSubmit}>
								<SearchIcon />
							</IconButton>
						</div>
						<div className="d-flex justify-content-end mt-2">
							<Button variant="contained" onClick={handleOpenCreateQuestionDialog}>
								<i className="fa-solid fa-plus me-2"></i>
								Tạo câu hỏi
							</Button>
						</div>
						<hr className="my-3" />
						<div>
							<FormGroup>
								{questionFilters.map((item, index) => (
									<div
										className="d-flex align-items-center justify-content-between"
										style={{ padding: 5, borderBottom: "1px solid #ccc" }}>
										<FormControlLabel
											className="mb-2 align-items-center"
											name={item.id}
											style={{ alignItems: "flex-start" }}
											control={
												<Checkbox
													className="pt-0"
													checked={isQuestionChecked(item.id)}
													onChange={(e) => {
														handleCheckedQuestion(item);
													}}
													name={item.id}
												/>
											}
											label={item.question}
										/>
										<span className={item.className.level || ""}>{item.levelTranslate}</span>
									</div>
								))}
							</FormGroup>
						</div>
					</div>
					<TablePagination
						component="div"
						count={questions.length || 0}
						rowsPerPageOptions={DEFAULT_OPTIONS}
						labelRowsPerPage="Số dòng mỗi trang"
						SelectProps={{
							inputProps: {
								"aria-label": "Số dòng mỗi trang",
							},
							native: true,
						}}
						page={pages}
						onPageChange={handlePaginationPageChange}
						rowsPerPage={rowsPerPages}
						onRowsPerPageChange={handlePaginationRowsPerPageChange}
					/>
				</div>
				<div className="col-8" style={styles.scrollContain}>
					<div className="p-2 d-flex justify-content-between align-items-center">
						<div>
							<span className="me-3" style={{ fontSize: 16, fontWeight: "bold" }}>
								Tỷ lệ câu hỏi:
							</span>
							<span className="bg-easy me-2">
								Dễ: ({getCountQuestion(EASY_LEVEL)}/{test?.easy_question})
							</span>
							<span className="bg-medium me-2">
								Vừa: ({getCountQuestion(MEDUIM_LEVEL)}/{test?.medium_question})
							</span>
							<span className="bg-difficult me-2">
								Khó: ({getCountQuestion(DIFFICULT_LEVEL)}/{test?.difficult_question})
							</span>
						</div>
						<div>
							<Button variant="contained" color="success" onClick={handleConfirmDialog} disabled={!canSaveTest()}>
								<i className="fa-solid fa-floppy-disk me-2"></i>
								Lưu thay đổi
							</Button>
						</div>
					</div>
					<hr />
					<div className="px-3">
						{selectedQuestions?.map((question, index) => (
							<div className="mb-3">
								<Typography variant="body1" style={{ fontWeight: "bold" }}>
									<Typography style={styles.answer_title}>Câu {index + 1}:</Typography>
									{question.question}
								</Typography>
								<Typography variant="body1" className="mb-2">
									<Typography variant="body1" style={styles.answer_title}>
										A.
									</Typography>
									{question.answer_a}
								</Typography>
								<Typography variant="body1" className="mb-2">
									<Typography variant="body1" style={styles.answer_title}>
										B.
									</Typography>
									{question.answer_b}
								</Typography>
								<Typography variant="body1" className="mb-2">
									<Typography variant="body1" style={styles.answer_title}>
										C.
									</Typography>
									{question.answer_c}
								</Typography>
								<Typography variant="body1" className="mb-2">
									<Typography variant="body1" style={styles.answer_title}>
										D.
									</Typography>
									{question.answer_d}
								</Typography>
							</div>
						))}
					</div>
				</div>
			</div>
			<CommonDialogComponent
				open={openConfirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog message="Xác nhận lưu đề thi?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openCreateQuestionDialog}
				title={"Tạo mới câu hỏi"}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onClose}>
				<CreateQuestionComponent onSubmit={handleCreateQuestion} type={CONST.DIALOG.TYPE.CREATE} />
			</CommonDialogComponent>
		</Box>
	);
}
const styles = {
	commonFilter: {
		border: "1px solid rgb(204, 204, 204)",
		borderRadius: "32px",
		paddingLeft: "12px",
		display: "flex",
	},
	answer_title: {
		fontWeight: "bold",
		display: "inline-block",
		marginRight: "6px",
	},
	scrollContain: {
		backgroundColor: "#fff",
		boxSizing: "border-box",
		overflowY: "scroll",
		height: "70vh",
	},
};
