import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { SubjectService } from "../Subject/SubjectService";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { QuestionService } from "../Question/QuestionService";
import "./User.css";
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

const levels = CONST.QUESTION.LEVEL_OBJ;
const correctAnswers = CONST.QUESTION.CORRECT_ANSWER_OBJ;

const CreateQuestion = ({ onSubmit, data, type, btnTitle }) => {
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
					label="Môn học"
					variant="outlined"
					name="subject_id"
					select
					className={isView() ? "disable-field" : ""}
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
					className={isView() ? "disable-field" : ""}
					label="Chương"
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
					className={isView() ? "disable-field" : ""}
					label="Câu hỏi"
					variant="outlined"
					name="question"
					error={Boolean(errors.question)}
					value={formData.question}
					onChange={handleChange}
					fullWidth
					rows={3}
					multiline
					margin="normal"
				/>
				<TextField
					className={isView() ? "disable-field" : ""}
					label="Câu trả lời A"
					variant="outlined"
					name="answer_a"
					error={Boolean(errors.answer_a)}
					value={formData.answer_a}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					className={isView() ? "disable-field" : ""}
					label="Câu trả lời B"
					variant="outlined"
					name="answer_b"
					error={Boolean(errors.answer_b)}
					value={formData.answer_b}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					className={isView() ? "disable-field" : ""}
					label="Câu trả lời C"
					variant="outlined"
					name="answer_c"
					error={Boolean(errors.answer_c)}
					value={formData.answer_c}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Câu trả lời D"
					variant="outlined"
					name="answer_d"
					error={Boolean(errors.answer_d)}
					value={formData.answer_d}
					onChange={handleChange}
					fullWidth
					margin="normal"
					className={isView() ? "disable-field" : ""}
				/>
				<div className="row-2">
					<TextField
						select
						label="Độ khó"
						variant="outlined"
						name="level"
						error={Boolean(errors.level)}
						value={formData.level}
						onChange={handleChange}
						margin="normal">
						{Object.keys(levels).map((level) => (
							<MenuItem key={level} value={levels[level]}>
								{level}
							</MenuItem>
						))}
					</TextField>
					<TextField
						className={isView() ? "disable-field" : ""}
						select
						label="Đáp án"
						variant="outlined"
						name="correct_answer"
						error={Boolean(errors.correct_answer)}
						value={formData.correct_answer}
						onChange={handleChange}
						margin="normal">
						{correctAnswers.map((answer, index) => (
							<MenuItem key={index} value={Object.values(answer)[0]}>
								{Object.keys(answer)[0]}
							</MenuItem>
						))}
					</TextField>
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

export default CreateQuestion;
