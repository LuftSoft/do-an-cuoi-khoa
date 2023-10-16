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
import { QuestionService } from "./QuestionService";

const initialValues = {
	question: "",
	level: "",
	answer_a: "",
	answer_b: "",
	answer_c: "",
	answer_d: "",
	correct_answer: "",
	chapter_id: "",
};

const levels = CONST.QUESTION.LEVEL_OBJ;
const correctAnswers = CONST.QUESTION.CORRECT_ANSWER_OBJ;

const CreateQuestion = ({ onSubmit }) => {
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
	useEffect(() => {
		getAllSubject().then((response) => {
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setSubjects(response.data?.data);
			} else {
				toast.error("Tải danh sách môn học thất bại");
			}
		});
	}, []);
	const [formData, setFormData] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubjectChange = (e) => {
		formData.chapter_id = "";
		if (e.target?.value) {
			setSubject(e.target.value);
			SubjectService.getChapterBySubjectId(e.target.value)
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
	};
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
		QuestionService.createQuestion(formData)
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
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Môn học"
					variant="outlined"
					name="subject_id"
					select
					value={subject}
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
					label="Chapter ID"
					variant="outlined"
					name="chapter_id"
					error={Boolean(errors.chapter_id)}
					select
					value={formData.chapter_id}
					onChange={handleChange}
					disabled={!subject}
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
					label="Question"
					variant="outlined"
					name="question"
					error={Boolean(errors.question)}
					value={formData.question}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					select
					label="Level"
					variant="outlined"
					name="level"
					error={Boolean(errors.level)}
					value={formData.level}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{Object.keys(levels).map((level) => (
						<MenuItem key={level} value={levels[level]}>
							{level}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Answer A"
					variant="outlined"
					name="answer_a"
					error={Boolean(errors.answer_a)}
					value={formData.answer_a}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer B"
					variant="outlined"
					name="answer_b"
					error={Boolean(errors.answer_b)}
					value={formData.answer_b}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer C"
					variant="outlined"
					name="answer_c"
					error={Boolean(errors.answer_c)}
					value={formData.answer_c}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer D"
					variant="outlined"
					name="answer_d"
					error={Boolean(errors.answer_d)}
					value={formData.answer_d}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					select
					label="Correct Answer"
					variant="outlined"
					name="correct_answer"
					error={Boolean(errors.correct_answer)}
					value={formData.correct_answer}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{correctAnswers.map((answer, index) => (
						<MenuItem key={index} value={Object.values(answer)[0]}>
							{Object.keys(answer)[0]}
						</MenuItem>
					))}
				</TextField>
				<Button type="submit" variant="contained" color="primary">
					Tạo mới
				</Button>
			</form>
		</Container>
	);
};

export default CreateQuestion;
