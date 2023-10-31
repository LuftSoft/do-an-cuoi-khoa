import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";
import { SubjectService } from "../Subject/SubjectService";
import { QuestionService } from "../Question/QuestionService";
import { SemesterService } from "../Semesters/SemesterService";
import { CreditClassService } from "./CreditClassService";

const initialValues = {
	name: "",
	subject_id: "",
	semester_id: "",
	semester_year: "",
	quantity: "",
};

const QUANTITY = {
	MIN: 1,
	MAX: 1000,
};

export default function CreateCreditClass({ onSubmit }) {
	const [subjects, setSubjects] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [semestersFilter, setSemestersFilter] = useState([]);
	const [years, setYears] = useState([]);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	async function getAllSubject() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getAllSubject();
		loadingService.setLoading(false);
		return subject;
	}
	function getAllYear(sems) {
		let set = new Set();
		sems.forEach((item) => {
			set.add(item.year);
		});
		return [...set];
	}
	async function getInitData() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getAllSubject();
		const semester = await SemesterService.getAllSemester();
		setSubjects(subject.data?.data || []);
		setSemesters(semester.data?.data || []);
		var year = getAllYear(semester.data?.data);
		setYears(year);
		loadingService.setLoading(false);
	}
	useEffect(() => {
		async function fetchData() {
			await getInitData();
		}
		fetchData();
	}, []);
	const [formData, setFormData] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

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
			console.log(errors);
			setErrors(errors);
			return;
		}
		CreditClassService.createCreditClass({
			subject_id: formData.subject_id,
			quantity: formData.quantity,
			semester_id: formData.semester_id,
			name: formData.name.trim(),
		})
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Tạo lớp tín chỉ thành công!");
					onSubmit(response.data);
				} else {
					toast.error(
						`Tạo lớp tín chỉ thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`,
					);
				}
			})
			.catch((err) => console.log("Error when create credit class: ", err));
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Năm học"
					variant="outlined"
					name="semester_year"
					select
					type="number"
					value={formData.semester_year}
					onChange={handleYearChange}
					fullWidth
					margin="normal">
					{years.map((y, index) => (
						<MenuItem key={index} value={y}>
							Năm học {y}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Học kỳ"
					variant="outlined"
					name="semester_id"
					error={Boolean(errors.semester_id)}
					select
					type="number"
					value={formData.semester_id}
					onChange={handleChange}
					fullWidth
					disabled={semestersFilter.length === 0}
					margin="normal">
					{semestersFilter.map((sm, index) => (
						<MenuItem key={index} value={sm.id}>
							Học kỳ {sm.semester}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Môn học"
					variant="outlined"
					name="subject_id"
					error={Boolean(errors.subject_id)}
					value={formData.subject_id}
					onChange={handleChange}
					fullWidth
					select
					margin="normal">
					{subjects.map((sj) => (
						<MenuItem key={sj.id} value={sj.id}>
							{sj.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Tên lớp tín chỉ"
					variant="outlined"
					name="name"
					error={Boolean(errors.name)}
					value={formData.name}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Số lượng"
					variant="outlined"
					type="number"
					inputProps={{ min: QUANTITY.MIN, max: QUANTITY.MAX }}
					name="quantity"
					error={Boolean(errors.quantity)}
					value={formData.quantity}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<Button type="submit" variant="contained" color="primary">
					Tạo lớp tín chỉ
				</Button>
			</form>
		</Container>
	);
}
