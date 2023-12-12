import React, { useEffect, useState } from "react";
import { TextField, Button, Container, MenuItem } from "@mui/material";
import { SubjectService } from "./SubjectService";
import { useLoadingService } from "../../contexts/loadingContext";
import { toast } from "react-toastify";
import { CONST } from "../../utils/const";

export default function CreateChapter({ onSubmit, data }) {
	const [chapter, setChapter] = useState({
		name: "",
		index: "",
		subject_id: "",
	});
	const [error, setErrors] = useState({});
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
		if (data.type === CONST.DIALOG.TYPE.EDIT) {
			getChapterDetail(data.id);
		}
	}, []);
	const getChapterDetail = async (id) => {
		try {
			const response = await SubjectService.getOneChapter(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setChapter(response.data?.data);
			} else {
				toast.error("Tải chi tiết chương thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải chi tiết chương");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		const errors = {};
		if (!chapter.name.trim()) {
			errors.name = "Vui lòng nhập tên chương";
		}
		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}
		loadingService.setLoading(true);
		try {
			switch (data.type) {
				case CONST.DIALOG.TYPE.ADD:
					const addResult = await SubjectService.createChapter(chapter);
					if (addResult.data.code === "SUCCESS") {
						toast.success("Tạo chương thành công!");
					} else {
						toast.error(addResult.data?.message || "Tạo chương thất bại");
					}
					onSubmit(addResult);
					break;
				case CONST.DIALOG.TYPE.EDIT:
					const editResult = await SubjectService.updateChapter(chapter);
					if (editResult.data.code === "SUCCESS") {
						toast.success("Chỉnh sửa chương thành công!");
					} else {
						toast.error(editResult.data?.message || "Chỉnh sửa chương thất bại");
					}
					onSubmit(editResult);
					break;
				default:
					loadingService.setLoading(false);
					break;
			}

			loadingService.setLoading(false);
		} catch (err) {
			loadingService.setLoading(false);
		}
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên chương"
					variant="outlined"
					fullWidth
					margin="normal"
					value={chapter.name}
					onChange={(e) => setChapter({ ...chapter, name: e.target.value })}
					error={Boolean(error.name)}
					helperText={error.name}
				/>
				{/* <TextField
					label="Thứ tự"
					variant="outlined"
					fullWidth
					margin="normal"
					value={chapter.index}
					type="number"
					inputProps={{ min: 1, max: 1000 }}
					onChange={(e) => setChapter({ ...chapter, index: e.target.value })}
					error={Boolean(error.index)}
					helperText={error.index}
				/> */}
				<TextField
					select
					label="Môn học"
					variant="outlined"
					name="subject"
					value={chapter.subject_id}
					error={Boolean(error.subject)}
					onChange={(e) => setChapter({ ...chapter, subject_id: e.target.value })}
					fullWidth
					margin="normal">
					{subjectList.map((subject, index) => (
						<MenuItem value={subject.id} key={index}>
							{subject.name}
						</MenuItem>
					))}
				</TextField>
				<Button className="mt-3" variant="contained" color="primary" type="submit">
					<i class="fa-solid fa-floppy-disk me-2"></i> Lưu
				</Button>
			</form>
		</Container>
	);
}
