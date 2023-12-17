import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { SubjectService } from "../Subject/SubjectService";
import { CONST, RESPONSE_MESSAGE } from "../../utils/const";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { FeHelpers } from "../../utils/helpers";
import { QuestionService } from "../Question/QuestionService";
import { SemesterService } from "../Semesters/SemesterService";
import { TestScheduleService } from "./TetsScheduleService";
import dayjs from "dayjs";

const initialValues = {
	id: "",
	name: "",
	semester_year: "",
	semester_id: "",
	date: "",
};

const levels = CONST.QUESTION.LEVEL_OBJ;
const correctAnswers = CONST.QUESTION.CORRECT_ANSWER_OBJ;

const EditTestScheduleComponent = ({ data, onSubmit }) => {
	const [years, setYears] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [semestersFilter, setSemestersFilter] = useState([]);
	const [formData, setFormData] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	function getAllYear(sems) {
		let set = new Set();
		sems.forEach((item) => {
			set.add(item.year);
		});
		return [...set];
	}
	async function getInitData() {
		loadingService.setLoading(true);
		const semester = await SemesterService.getAllSemester();
		setSemesters(semester.data?.data || []);
		var year = getAllYear(semester.data?.data);
		setYears(year);
		try {
			const response = await TestScheduleService.getOneTestSchedule(data.id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let resData = response.data?.data;
				resData.semester_year = semester.data?.data?.filter((item) => item.id === resData.semester_id)[0]?.year;
				resData.date = dayjs(resData.date).format("YYYY-MM-DD hh:mm:ss");
				const filter = semester.data?.data?.filter((item) => {
					return item.year == resData.semester_year;
				});
				setSemestersFilter(filter);
				setFormData(resData);
			} else {
				toast.error(`Tạo ca thi thất bại. Lỗi: ${response.data.message ? response.data.message : "Không xác định!"}`);
			}
		} catch (err) {
			console.log("Error when create question: ", err);
		}
		loadingService.setLoading(false);
	}
	useEffect(() => {
		async function fetchData() {
			await getInitData();
		}
		fetchData();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleYearChange = (e) => {
		const { name, value } = e.target;
		formData[name] = value;
		formData.semester_id = "";
		setFormData(formData);
		if (e.target) {
			const { name, value } = e.target;
			const filter = semesters.filter((item) => {
				return item.year == value;
			});
			setSemestersFilter(filter);
		}
	};
	const handleSubmit = async (e) => {
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
		try {
			const response = await TestScheduleService.updateTestSchedule(formData);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success(RESPONSE_MESSAGE.TEST_SCHEDULE.UPDATE_SUCCESS);
				onSubmit(response.data);
			} else {
				toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.UPDATE_FAILED);
			}
		} catch (err) {
			toast.error(RESPONSE_MESSAGE.TEST_SCHEDULE.UPDATE_FAILED);
			console.log("Error when create question: ", err);
		}
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Năm học"
					variant="outlined"
					name="semester_year"
					select
					value={formData.semester_year}
					onChange={handleYearChange}
					fullWidth
					margin="normal">
					{years.map((year, index) => (
						<MenuItem key={year} value={year}>
							Năm học {year} - {year + 1}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Học kỳ"
					variant="outlined"
					name="semester_id"
					error={Boolean(errors.semester_id)}
					select
					value={formData.semester_id}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{!semestersFilter || semestersFilter.length === 0 ? (
						<MenuItem key="default-chapter">Không có dữ liệu</MenuItem>
					) : (
						""
					)}
					{semestersFilter.map((c) => (
						<MenuItem key={c.id} value={c.id}>
							Học kỳ {c.semester}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Tên ca thi"
					variant="outlined"
					name="name"
					error={Boolean(errors.name)}
					value={formData.name}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Thời gian bắt đầu"
					variant="outlined"
					name="date"
					error={Boolean(errors.date)}
					value={formData.date}
					onChange={handleChange}
					fullWidth
					type="datetime-local"
					margin="normal"
				/>
				<Button type="submit" variant="contained" color="primary">
					<i class="fa-solid fa-floppy-disk me-2"></i>Lưu
				</Button>
			</form>
		</Container>
	);
};

export default EditTestScheduleComponent;
