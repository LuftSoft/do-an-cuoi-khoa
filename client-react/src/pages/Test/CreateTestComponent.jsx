import React, { useEffect, useState } from "react";
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

const initialValues = {
	id: "",
	question: "",
	level: "",
	answer_a: "",
	answer_b: "",
	answer_c: "",
	answer_d: "",
	correct_answer: "",
	chapter_id: "",
	subject_id: "",
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

const levels = CONST.QUESTION.LEVEL_OBJ;
const correctAnswers = CONST.QUESTION.CORRECT_ANSWER_OBJ;

const CreateTest = ({ onSubmit, data, type, btnTitle }) => {
	console.log(data, type);
	const [formData, setFormData] = useState(initialValues);
	const accessToken = useSelector(selectAccessToken);
	const [subject, setSubject] = useState("");
	const [chapters, setChapters] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();

	async function getAllSubject() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getAllSubject();
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
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
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
		const errors = {};
		Object.keys(formData).forEach((item) => {
			if (FeHelpers.isStringEmpty(formData[item])) {
				errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
			}
		});
		// console.log(formData);
		// console.log(errors);
		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}
		switch (type) {
			case CONST.DIALOG.TYPE.EDIT:
				QuestionService.updateQuestion(formData, accessToken)
					.then((response) => {
						if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
							toast.success("Chỉnh sửa câu hỏi thành công!");
							onSubmit(response.data);
						} else {
							toast.error(
								`Chỉnh sửa câu hỏi thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
							);
						}
					})
					.catch((err) => console.log("Error when create question: ", err));
				break;
			case CONST.DIALOG.TYPE.CREATE:
				QuestionService.createQuestion(formData, accessToken)
					.then((response) => {
						if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
							toast.success("Tạo câu hỏi thành công!");
							onSubmit(response.data);
						} else {
							toast.error(
								`Tạo câu hỏi thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
							);
						}
					})
					.catch((err) => console.log("Error when create question: ", err));
				break;
		}
	};
	function isView() {
		return type === CONST.DIALOG.TYPE.VIEW;
	}
	async function getQuestion() {
		return await QuestionService.getOneQuestion(data.id);
	}

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên đề kiểm tra"
					variant="outlined"
					name="name"
					className={isView() ? "disable-field" : ""}
					value={formData.subject_id}
					onChange={handleSubjectChange}
					fullWidth
					margin="normal"
				/>
				<div className="row-flex">
					<TextField
						className={isView() ? "disable-field w-7" : "w-7"}
						label="Chọn ca thi"
						variant="outlined"
						name="chapter_id"
						error={Boolean(errors.chapter_id)}
						select
						value={formData.chapter_id}
						onChange={handleChange}
						fullWidth
						margin="normal">
						{!chapters || chapters.length === 0 ? <MenuItem key="default-chapter">Không có dữ liệu</MenuItem> : ""}
						{chapters.map((c) => (
							<MenuItem key={c.id} value={c.id}>
								{c.name}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						label="Thời gian làm bài (phút)"
						name="question"
						type="number"
						margin="normal"
						variant="outlined"
						onChange={handleChange}
						value={formData.question}
						error={Boolean(errors.question)}
						InputProps={{ inputProps: { min: 0 } }}
						className={isView() ? "disable-field w-5" : " w-5"}>
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
						label="Môn học"
						variant="outlined"
						name="subject_id"
						select
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
						name="answer_c"
						margin="normal"
						variant="outlined"
						onChange={handleChange}
						value={formData.answer_c}
						error={Boolean(errors.answer_c)}
						className={isView() ? "disable-field w-4" : "w-4"}
					/>
				</div>
				<Autocomplete
					multiple
					id="tags-outlined"
					options={chapters}
					filterSelectedOptions
					getOptionLabel={(option) => option.title}
					style={{ marginTop: 16, marginBottom: 8 }}
					renderInput={(params) => <TextField {...params} label="Chương" placeholder="Có thể chọn nhiều chương..." />}
				/>
				<div className="row-flex">
					<TextField
						fullWidth
						label="Tổng số câu hỏi"
						margin="normal"
						name="answer_c"
						variant="outlined"
						onChange={handleChange}
						value={formData.answer_c}
						error={Boolean(errors.answer_c)}
						className={isView() ? "disable-field w-4" : " w-4"}
					/>
					<TextField
						fullWidth
						label="Số câu dễ"
						name="answer_d"
						margin="normal"
						variant="outlined"
						onChange={handleChange}
						value={formData.answer_d}
						error={Boolean(errors.answer_d)}
						className={isView() ? "disable-field w-4" : " w-4"}
					/>
					<TextField
						fullWidth
						name="level"
						label="Số câu trung bình"
						margin="normal"
						variant="outlined"
						value={formData.level}
						onChange={handleChange}
						error={Boolean(errors.level)}
						className={isView() ? "disable-field w-4" : " w-4"}
					/>
					<TextField
						fullWidth
						label="Số câu khó"
						name="correct_answer"
						variant="outlined"
						onChange={handleChange}
						value={formData.correct_answer}
						error={Boolean(errors.correct_answer)}
						className={isView() ? "disable-field w-4" : " w-4"}
						margin="normal"
					/>
				</div>
				<div className="row-flex">
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Tự động lấy từ ngân hàng câu hỏi"
						/>
					</div>
					<div className="w-3">
						<FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="Xem điểm sau khi thi" />
					</div>
					<div className="w-3">
						<FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="Đảo đáp án" />
					</div>
				</div>
				<div className="row-flex">
					<div className="w-3">
						<FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="Đảo câu hỏi" />
					</div>
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Xem kết quả chi tiết sau khi thi"
						/>
					</div>
					<div className="w-3">
						<FormControlLabel
							control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
							label="Tự động nộp bài khi chuyển tab"
						/>
					</div>
				</div>
				{isView() ? null : (
					<div className="form-footer">
						<Button type="submit" variant="contained" color="primary" className="mt-3 px-4">
							<i class="fa-solid fa-floppy-disk me-2"></i> {btnTitle || "Lưu"}
						</Button>
					</div>
				)}
			</form>
		</Container>
	);
};

export default CreateTest;
