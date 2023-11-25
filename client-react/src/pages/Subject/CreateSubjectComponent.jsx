import React, { useEffect, useState } from "react";
import { TextField, Button, Container, MenuItem } from "@mui/material";
import { SubjectService } from "./SubjectService";
import { useLoadingService } from "../../contexts/loadingContext";
import { toast } from "react-toastify";
import { CONST } from "../../utils/const";

export default function CreateSubject({ data, onSubmit }) {
	const [departments, setDepartments] = useState([]);
	const [departmentId, setDepartmentId] = useState("");
	const [subject, setSubject] = useState({
		name: "",
		credit: "",
		theoretical_lesson: "",
		pratical_lesson: "",
		department_id: "",
	});
	const [error, setError] = useState({});
	const loadingService = useLoadingService();
	useEffect(() => {
		setDepartmentId(data?.id || "");
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	const getInitData = async () => {
		switch (data.type) {
			case CONST.DIALOG.TYPE.ADD:
				break;
			case CONST.DIALOG.TYPE.EDIT:
				await getSubjectDetail();
				break;
		}
		await getDepartment();
	};
	const getDepartment = async () => {
		const response = await SubjectService.getAllDepartment();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setDepartments(response.data?.data);
		} else {
			toast.error("Tải danh sách khoa không thành công");
		}
	};
	const getSubjectDetail = async () => {
		const response = await SubjectService.getOneSubject(data?.id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setSubject(response.data?.data);
		} else {
			toast.error("Lấy chi tiết môn học không thành công");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		const errors = {};
		if (!subject.name.trim()) {
			errors.name = "Name is required";
		}

		// If there are validation errors, set the error state
		if (Object.keys(errors).length > 0) {
			setError(errors);
			return;
		}
		loadingService.setLoading(true);
		try {
			let result;
			if (data.type === CONST.DIALOG.TYPE.ADD) {
				result = await SubjectService.createSubject(subject);
				if (result.data.code === "SUCCESS") {
					toast.success("Tạo môn học thành công!");
				} else {
					toast.error(result.data?.message || "Tạo môn học thất bại");
				}
			} else if (data.type === CONST.DIALOG.TYPE.EDIT) {
				result = await SubjectService.updateSubject(subject);
				if (result.data.code === "SUCCESS") {
					toast.success("Chỉnh sửa môn học thành công!");
				} else {
					toast.error(result.data?.message || "Chỉnh sửa môn học thất bại");
				}
			}
			loadingService.setLoading(false);

			onSubmit(result);
		} catch (err) {
			loadingService.setLoading(false);
			onSubmit(false);
		}
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Tên môn học"
					variant="outlined"
					fullWidth
					margin="normal"
					value={subject.name}
					onChange={(e) => setSubject({ ...subject, name: e.target.value })}
					error={Boolean(error.name)}
					helperText={error.name}
				/>
				<TextField
					label="Số tín chỉ"
					variant="outlined"
					fullWidth
					margin="normal"
					value={subject.credit}
					type="number"
					inputProps={{ min: 1, max: 1000 }}
					onChange={(e) => setSubject({ ...subject, credit: e.target.value })}
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
					value={subject.theoretical_lesson}
					onChange={(e) => setSubject({ ...subject, theoretical_lesson: e.target.value })}
					error={Boolean(error.theoretical_lesson)}
					helperText={error.theoretical_lesson}
				/>
				<TextField
					label="Số tiết thực hành"
					type="number"
					variant="outlined"
					inputProps={{ min: 1, max: 1000 }}
					fullWidth
					margin="normal"
					value={subject.pratical_lesson}
					onChange={(e) => setSubject({ ...subject, pratical_lesson: e.target.value })}
					error={Boolean(error.pratical_lesson)}
					helperText={error.pratical_lesson}
				/>
				<TextField
					select
					label="Khoa"
					variant="outlined"
					name="department_id"
					error={Boolean(error.department_id)}
					value={subject.department_id}
					onChange={(e) => setSubject({ ...subject, department_id: e.target.value })}
					fullWidth
					margin="normal">
					{departments.map((department, index) => (
						<MenuItem value={department.id} key={index}>
							{department.name}
						</MenuItem>
					))}
				</TextField>
				<Button className="mt-3" variant="contained" color="primary" type="submit">
					<i class="fa-solid fa-floppy-disk me-2"></i>Lưu
				</Button>
			</form>
		</Container>
	);
}
