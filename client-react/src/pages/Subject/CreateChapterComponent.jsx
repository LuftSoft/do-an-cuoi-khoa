import React, { useEffect, useState } from "react";
import { TextField, Button, Container, MenuItem } from "@mui/material";
import { SubjectService } from "./SubjectService";
import { useLoadingService } from "../../contexts/loadingContext";
import { toast } from "react-toastify";

export default function CreateChapter({ onSubmit }) {
	const [name, setName] = useState("");
	const [index, setIndex] = useState("");
	const [subject, setSubject] = useState("");
	const [error, setError] = useState({});
	const [subjectList, setSubjectList] = useState([]);
	const loadingService = useLoadingService();
	async function getAllSubject() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getAllSubject();
		loadingService.setLoading(false);
		return subject;
	}
	useEffect(() => {
		getAllSubject().then((response) => {
			setSubjectList(response.data.data);
		});
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		const errors = {};
		if (!name.trim()) {
			errors.name = "Name is required";
		}
		if (Object.keys(errors).length > 0) {
			setError(errors);
			return;
		}
		const chapter = {
			name: name,
			index: index,
			subject_id: subject,
		};
		loadingService.setLoading(true);
		const result = await SubjectService.createChapter(chapter);
		loadingService.setLoading(false);
		if (result.data.code === "SUCCESS") {
			toast.success("Tạo chương thành công!");
		} else {
			toast.error(result.data?.message || "Tạo chương thất bại");
		}
		onSubmit(result);
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên chương"
					variant="outlined"
					fullWidth
					margin="normal"
					value={name}
					onChange={(e) => setName(e.target.value)}
					error={Boolean(error.name)}
					helperText={error.name}
				/>
				<TextField
					label="Thứ tự"
					variant="outlined"
					fullWidth
					margin="normal"
					value={index}
					type="number"
					inputProps={{ min: 1, max: 1000 }}
					onChange={(e) => setIndex(e.target.value)}
					error={Boolean(error.index)}
					helperText={error.index}
				/>
				<TextField
					select
					label="Môn học"
					variant="outlined"
					name="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					fullWidth
					margin="normal">
					{subjectList.map((subject, index) => (
						<MenuItem value={subject.id} key={index}>
							{subject.name}
						</MenuItem>
					))}
				</TextField>
				{/* <TextField
					label="Email"
					variant="outlined"
					fullWidth
					margin="normal"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={Boolean(error.email)}
					helperText={error.email}
				/>
				<TextField
					label="Message"
					variant="outlined"
					fullWidth
					multiline
					rows={4}
					margin="normal"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					error={Boolean(error.message)}
					helperText={error.message}
				/> */}
				<Button className="mt-3" variant="contained" color="primary" type="submit">
					<i class="fa-solid fa-floppy-disk me-2"></i> Lưu
				</Button>
			</form>
		</Container>
	);
}
