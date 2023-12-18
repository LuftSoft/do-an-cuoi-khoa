import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Autocomplete, Container, FormControlLabel, Switch, styled } from "@mui/material";
import { SubjectService } from "../Subject/SubjectService";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { QuestionService } from "../Question/QuestionService";
import "../Question/Question.css";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { TestScheduleService } from "../TestSchedule/TetsScheduleService";
import { TestService } from "./TestService";
import { SemesterService } from "../Semesters/SemesterService";
import { CommonDialogComponent } from "../../components/Common";
import TestDetailComponent from "./TestDetailComponent";
import TestEditComponent from "./TestEditComponent";
import TestCreateDetailComponent from "./TestCreateDetailComponent";

const initialValues = {
	id: "",
	name: "",
	test_schedule_id: "",
	password: "",
	time: "",
	total_question: 0,
	easy_question: 0,
	medium_question: 0,
	difficult_question: 0,
	semester_year: "",
	semester_id: "",
	subject_id: "",
	user_id: "",
	chapters: "",
	total_mark: "",
	auto_generate_question: true,
	swap_question: true,
	swap_answer: true,
	show_mark: true,
	show_correct_answer: true,
	submit_when_switch_tab: true,
};
const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
	({ theme }) => ({
		width: 42,
		height: 26,
		padding: 0,
		"& .MuiSwitch-switchBase": {
			padding: 0,
			margin: 2,
			transitionDuration: "300ms",
			"&.Mui-checked": {
				transform: "translateX(16px)",
				color: "#fff",
				"& + .MuiSwitch-track": {
					backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
					opacity: 1,
					border: 0,
				},
				"&.Mui-disabled + .MuiSwitch-track": {
					opacity: 0.5,
				},
			},
			"&.Mui-focusVisible .MuiSwitch-thumb": {
				color: "#33cf4d",
				border: "6px solid #fff",
			},
			"&.Mui-disabled .MuiSwitch-thumb": {
				color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
			},
		},
		"& .MuiSwitch-thumb": {
			boxSizing: "border-box",
			width: 22,
			height: 22,
		},
		"& .MuiSwitch-track": {
			borderRadius: 26 / 2,
			backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
			opacity: 1,
			transition: theme.transitions.create(["background-color"], {
				duration: 500,
			}),
		},
	}),
);

const CreateTest = ({ onSubmit, data, type, btnTitle }) => {
	// console.log(data, type);
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [chapters, setChapters] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [errors, setErrors] = useState({});
	const [testSchedules, setTestSchedules] = useState([]);
	const total_question = useRef(0);
	const loadingService = useLoadingService();
	const [years, setYears] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [semestersFilter, setSemestersFilter] = useState([]);
	const [openTestEditDialog, setOpenTestEditDialog] = useState(false);
	const [test, setTest] = useState({});

	async function getAllSubject() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getSubjectByUserId(accessToken);
		loadingService.setLoading(false);
		return subject;
	}
	//init value
	useEffect(() => {
		const fetchData = async () => {
			let res = {};
			getAllSubject().then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setSubjects(response.data?.data);
				} else {
					toast.error("Tải danh sách môn học thất bại");
				}
			});
			const semester = await SemesterService.getAllSemester();
			setSemesters(semester.data?.data || []);
			var year = getAllYear(semester.data?.data);
			setYears(year);
			switch (type) {
				case CONST.DIALOG.TYPE.CREATE:
					break;
				case CONST.DIALOG.TYPE.EDIT:
					res = await getQuestion(data.id);
					getChapterBySubject(data.subject_id).then(() => {
						convertToFromData(res.data?.data);
					});
					break;
				case CONST.DIALOG.TYPE.VIEW:
					res = await getQuestion(data.id);
					getChapterBySubject(data.subject_id).then(() => {
						convertToFromData(res.data?.data);
					});
					break;
				default:
					break;
			}
		};
		fetchData();
	}, []);
	function getAllYear(sems) {
		let set = new Set();
		sems.forEach((item) => {
			set.add(item.year);
		});
		return [...set];
	}
	function convertToFromData(question) {
		let tmp = {};
		Object.keys(question).forEach((key) => {
			if (formData[key] != undefined) {
				tmp[key] = question[key] || "";
			}
		});
		setFormData(tmp);
	}
	const handleChange = (e) => {
		let total = 0;
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (["easy_question", "medium_question", "difficult_question"].includes(name)) {
			total_question.current =
				Number.parseInt(formData.easy_question || 0) +
				Number.parseInt(formData.medium_question || 0) +
				Number.parseInt(formData.difficult_question || 0) +
				Number.parseInt(value || 0) -
				Number.parseInt(formData[name] || 0);
		}
	};

	const handleSwitchChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleAutocompleteChange = (event, newValue) => {
		setFormData({ ...formData, chapters: newValue.map((item) => item.id).join(",") });
	};

	const handleSubjectChange = (e) => {
		formData.chapter_id = "";
		if (e.target?.value) {
			setFormData({ ...formData, subject_id: e.target?.value });
			getChapterBySubject(e.target?.value);
		}
	};
	function getChapterBySubject(id) {
		return SubjectService.getChapterBySubjectId(id)
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setChapters(response.data?.data ? response.data?.data : []);
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Tải danh sách chương thất bại");
			});
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData, type);
		const errors = {};
		formData.start_time = testSchedules.filter((t) => t.id === formData.test_schedule_id)[0]?.date;
		formData.end_time = new Date(
			new Date(formData.start_time).getTime() + Number.parseInt(formData.schedule_time) * 60000,
		);
		console.log(formData);
		// Object.keys(formData).forEach((item) => {
		// 	if (FeHelpers.isStringEmpty(formData[item])) {
		// 		errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
		// 	}
		// });
		// if (Object.keys(errors).length > 0) {
		// 	setErrors(errors);
		// 	return;
		// }
		switch (type) {
			case CONST.DIALOG.TYPE.EDIT:
				QuestionService.updateQuestion(formData, accessToken)
					.then((response) => {
						if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
							toast.success("Chỉnh sửa đề thi thành công!");
							onSubmit(response.data);
						} else {
							toast.error(
								`Chỉnh sửa đề thi thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
							);
						}
					})
					.catch((err) => console.log("Error when create question: ", err));
				break;
			case CONST.DIALOG.TYPE.CREATE:
				if (!formData.auto_generate_question) {
					setOpenTestEditDialog(true);
				} else {
					TestService.createTest(formData, accessToken)
						.then((response) => {
							if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
								toast.success("Tạo đề thi thành công!");
								onSubmit(response.data);
							} else {
								toast.error(
									`Tạo đề thi thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
								);
							}
						})
						.catch((err) => console.log("Error when create question: ", err));
				}
				break;
		}
	};
	function isView() {
		return type === CONST.DIALOG.TYPE.VIEW;
	}
	async function getQuestion() {
		return await QuestionService.getOneQuestion(data.id);
	}
	function getChapterOpt(option) {
		console.log(option);
		setFormData({ ...formData, chapter_id: option.id });
		return option.name;
	}
	async function getTestSchedule() {
		const response = await TestScheduleService.getAllTestSchedule();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			return response.data?.data;
		} else {
			toast.error("Get test schedule failed");
			return [];
		}
	}
	function handleYearChange(e) {
		try {
			if (e.target?.value) {
				const { name, value } = e.target;
				setFormData({ ...formData, [name]: value });
				let semFilter = semesters.filter((item) => item.year === e.target?.value);
				setSemestersFilter(semFilter);
			}
		} catch (err) {}
	}
	const onCloseDialog = () => {
		setOpenTestEditDialog(false);
	};
	const handleTestDetailSubmit = async () => {
		setOpenTestEditDialog(false);
		onSubmit(false);
	};
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên đề kiểm tra"
					variant="outlined"
					name="name"
					className={isView() ? "disable-field" : ""}
					value={formData.name}
					error={Boolean(errors.name)}
					onChange={handleChange}
					fullWidth
					required
					margin="normal"
				/>

				<div className="row-flex">
					<TextField
						label="Môn học"
						variant="outlined"
						name="subject_id"
						select
						required
						className={isView() ? "disable-field w-8" : " w-8"}
						value={formData.subject_id}
						onChange={handleSubjectChange}
						fullWidth
						margin="normal">
						{subjects.map((sj) => (
							<MenuItem key={sj.id} value={sj.id}>
								{sj.name}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						label="Tổng điểm"
						name="total_mark"
						margin="normal"
						type="number"
						required
						InputProps={{ inputProps: { min: 0 } }}
						variant="outlined"
						onChange={handleChange}
						value={formData.total_mark}
						error={Boolean(errors.total_mark)}
						className={isView() ? "disable-field w-4" : "w-4"}
					/>
				</div>

				<Autocomplete
					multiple
					id="tags-outlined"
					options={chapters}
					noOptionsText="Chưa có dữ liệu"
					filterSelectedOptions
					getOptionLabel={(option) => option.name}
					onChange={handleAutocompleteChange}
					style={{ marginTop: 16, marginBottom: 8 }}
					renderInput={(params) => <TextField {...params} label="Chương" placeholder="Có thể chọn nhiều chương..." />}
				/>

				<div className="row-flex">
					<TextField
						label="Năm học"
						variant="outlined"
						name="semester_year"
						select
						required
						type="number"
						value={formData.semester_year}
						onChange={handleYearChange}
						fullWidth
						margin="normal"
						className={isView() ? "disable-field w-3" : "w-3"}>
						{years.map((y, index) => (
							<MenuItem key={index} value={y}>
								Năm học {y} - {y + 1}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="Học kỳ"
						variant="outlined"
						required
						name="semester_id"
						error={Boolean(errors.semester_id)}
						select
						type="number"
						value={formData.semester_id}
						onChange={handleChange}
						fullWidth
						disabled={semestersFilter.length === 0}
						margin="normal"
						className={isView() ? "disable-field w-3" : "w-3"}>
						{semestersFilter.map((sm, index) => (
							<MenuItem key={index} value={sm.id}>
								Học kỳ {sm.semester}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						label="Thời gian làm bài (phút)"
						name="time"
						type="number"
						margin="normal"
						required
						variant="outlined"
						onChange={handleChange}
						value={formData.time}
						error={Boolean(errors.time)}
						InputProps={{ inputProps: { min: 0 } }}
						className={isView() ? "disable-field w-5" : "w-5"}>
						<Button
							variant="solid"
							color="primary"
							loading={data.status === "loading"}
							type="submit"
							sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
							Subscribe
						</Button>
					</TextField>
				</div>

				<div className="row-flex">
					<TextField
						fullWidth
						label="Tổng số câu hỏi"
						margin="normal"
						name="total_question"
						variant="outlined"
						type="number"
						value={total_question.current}
						className="w-4 readonly-field"
					/>
					<TextField
						fullWidth
						label="Số câu dễ"
						name="easy_question"
						margin="normal"
						variant="outlined"
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						onChange={handleChange}
						value={formData.easy_question}
						error={Boolean(errors.easy_question)}
						className={isView() ? "disable-field w-4" : " w-4"}
					/>
					<TextField
						fullWidth
						name="medium_question"
						label="Số câu trung bình"
						margin="normal"
						variant="outlined"
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						value={formData.medium_question}
						onChange={handleChange}
						error={Boolean(errors.medium_question)}
						className={isView() ? "disable-field w-4" : " w-4"}
					/>
					<TextField
						fullWidth
						label="Số câu khó"
						name="difficult_question"
						variant="outlined"
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						onChange={handleChange}
						value={formData.difficult_question}
						error={Boolean(errors.difficult_question)}
						className={isView() ? "disable-field w-4" : " w-4"}
						margin="normal"
					/>
				</div>
				<div className="row-flex">
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Tự động lấy từ ngân hàng câu hỏi"
							name="auto_generate_question"
							value={formData.auto_generate_question}
							onChange={(e) => handleSwitchChange("auto_generate_question", !formData.auto_generate_question)}
						/>
					</div>
					{/* <div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Xem điểm sau khi thi"
							name="show_mark"
							value={formData.show_mark}
							onChange={(e) => handleSwitchChange("show_mark", !formData.show_mark)}
						/>
					</div>
					<div className="w-3">
						<FormControlLabel
							control={
								<IOSSwitch
									sx={{ m: 1 }}
									defaultChecked
									name="swap_answer"
									value={formData.swap_answer}
									onChange={(e) => handleSwitchChange("swap_answer", !formData.swap_answer)}
								/>
							}
							label="Đảo đáp án"
						/>
					</div> */}
				</div>
				{/* <div className="row-flex">
					<div className="w-3">
						<FormControlLabel
							control={
								<IOSSwitch
									sx={{ m: 1 }}
									defaultChecked
									name="swap_question"
									value={formData.swap_question}
									onChange={(e) => handleSwitchChange("swap_question", !formData.swap_question)}
								/>
							}
							label="Đảo câu hỏi"
						/>
					</div>
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Xem kết quả chi tiết sau khi thi"
							name="show_correct_answer"
							value={formData.show_correct_answer}
							onChange={(e) => handleSwitchChange("show_correct_answer", !formData.show_correct_answer)}
						/>
					</div>
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Tự động nộp bài khi chuyển tab"
							name="submit_when_switch_tab"
							value={formData.submit_when_switch_tab}
							onChange={(e) => handleSwitchChange("submit_when_switch_tab", !formData.submit_when_switch_tab)}
						/>
					</div>
				</div> */}
				{isView() ? null : (
					<div className="form-footer">
						<Button type="submit" variant="contained" color="primary" className="mt-3 px-4">
							<i className="fa-solid fa-floppy-disk me-2"></i> {btnTitle || "Lưu"}
						</Button>
					</div>
				)}
			</form>
			<CommonDialogComponent
				open={openTestEditDialog}
				title={"Tạo chi tiết đề thi"}
				icon="fa-solid fa-circle-info"
				width="60vw"
				height="auto"
				onClose={onCloseDialog}>
				<TestCreateDetailComponent handleSubmit={handleTestDetailSubmit} test={formData}></TestCreateDetailComponent>
			</CommonDialogComponent>
		</Container>
	);
};

export default CreateTest;
