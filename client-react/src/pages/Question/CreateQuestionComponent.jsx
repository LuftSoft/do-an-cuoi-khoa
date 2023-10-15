import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

const initialValues = {
	question: "",
	level: "",
	answer_a: "",
	answer_b: "",
	answer_c: "",
	answer_d: "",
	correct_answer: "",
	chapter_id: 0,
};

const levels = ["Easy", "Medium", "Hard"];
const correctAnswers = ["A", "B", "C", "D"];

const CreateQuestion = () => {
	const [formData, setFormData] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission with formData
		console.log(formData);
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Question"
					variant="outlined"
					name="question"
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
					value={formData.level}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{levels.map((level) => (
						<MenuItem key={level} value={level}>
							{level}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Answer A"
					variant="outlined"
					name="answer_a"
					value={formData.answer_a}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer B"
					variant="outlined"
					name="answer_b"
					value={formData.answer_b}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer C"
					variant="outlined"
					name="answer_c"
					value={formData.answer_c}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Answer D"
					variant="outlined"
					name="answer_d"
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
					value={formData.correct_answer}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{correctAnswers.map((answer) => (
						<MenuItem key={answer} value={answer}>
							{answer}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Chapter ID"
					variant="outlined"
					name="chapter_id"
					type="number"
					value={formData.chapter_id}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<Button type="submit" variant="contained" color="primary">
					Tạo mới
				</Button>
			</form>
		</Container>
	);
};

export default CreateQuestion;
