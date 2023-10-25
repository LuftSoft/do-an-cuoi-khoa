import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import { SubjectService } from "./SubjectService";
import { useLoadingService } from "../../contexts/loadingContext";
import { toast } from "react-toastify";

export default function CreateSubject({ onSubmit }) {
	const [name, setName] = useState("");
	const [credit, setCredit] = useState("");
	const [theoreticalLesson, setTheoreticalLesson] = useState("");
	const [praticalLesson, setPraticalLesson] = useState("");
	const [error, setError] = useState({});
	const loadingService = useLoadingService();
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		const errors = {};
		if (!name.trim()) {
			errors.name = "Name is required";
		}
		// if (!email.trim()) {
		// 	errors.email = "Email is required";
		// } else if (!/\S+@\S+\.\S+/.test(email)) {
		// 	errors.email = "Invalid email format";
		// }

		// If there are validation errors, set the error state
		if (Object.keys(errors).length > 0) {
			setError(errors);
			return;
		}
		const subject = {
			name: name,
			credit: credit,
			theoretical_lesson: theoreticalLesson,
			pratical_lesson: praticalLesson,
		};
		loadingService.setLoading(true);
		const result = await SubjectService.createSubject(subject);
		loadingService.setLoading(false);
		if (result.data.code === "SUCCESS") {
			toast.success("Tạo môn học thành công!");
		} else {
			toast.error(result.data?.message || "Tạo môn học thất bại");
		}
		onSubmit(result);
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên môn học"
					variant="outlined"
					fullWidth
					margin="normal"
					value={name}
					onChange={(e) => setName(e.target.value)}
					error={Boolean(error.name)}
					helperText={error.name}
				/>
				<TextField
					label="Số tín chỉ"
					variant="outlined"
					fullWidth
					margin="normal"
					value={credit}
					type="number"
					inputProps={{ min: 1, max: 1000 }}
					onChange={(e) => setCredit(e.target.value)}
					error={Boolean(error.credit)}
					helperText={error.credit}
				/>
				<TextField
					label="Số tiết lý thuyết"
					variant="outlined"
					type="number"
					fullWidth
					margin="normal"
					inputProps={{ min: 1, max: 1000 }}
					value={theoreticalLesson}
					onChange={(e) => setTheoreticalLesson(e.target.value)}
					error={Boolean(error.theoreticalLesson)}
					helperText={error.theoreticalLesson}
				/>
				<TextField
					label="Số tiết thực hành"
					type="number"
					variant="outlined"
					inputProps={{ min: 1, max: 1000 }}
					fullWidth
					margin="normal"
					value={praticalLesson}
					onChange={(e) => setPraticalLesson(e.target.value)}
					error={Boolean(error.praticalLesson)}
					helperText={error.praticalLesson}
				/>
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
					<i class="fa-solid fa-floppy-disk me-2"></i>Lưu
				</Button>
			</form>
		</Container>
	);
}
