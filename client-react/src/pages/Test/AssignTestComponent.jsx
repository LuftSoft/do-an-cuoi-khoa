import { Autocomplete, Container } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";
import { SubjectService } from "../Subject/SubjectService";
import { QuestionService } from "../Question/QuestionService";
import { SemesterService } from "../Semesters/SemesterService";
import { CreditClassService } from "../CreditClass/CreditClassService";
import { UserService } from "../User/UserService";
import "./TestComp.css";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { TestScheduleService } from "../TestSchedule/TetsScheduleService";
import { TestService } from "./TestService";

const initialValues = {
	id: 0,
	test_id: "",
	credit_class_id: "",
	test_schedule_id: "",
};

const QUANTITY = {
	MIN: 1,
	MAX: 1000,
};

export default function AssignTestComponent(props) {
	const test = props?.data;
	const [errors, setErrors] = useState({});
	const { loading, setLoading } = useLoadingService();
	const testSchedulesRef = useRef([]);
	const [creditClasses, setCreditClasses] = useState([]);
	const [testSchedules, setTestSchedules] = useState([]);
	const [dataSource, setDataSource] = useState([]);
	const [testClassRemove, setTestClassRemove] = useState({});
	const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
	async function getInitData() {
		setLoading(true);
		await getCreditClasses();
		await getTestSchedule();
		await getTestClass(test?.id);
		initFormData();
		setLoading(false);
	}
	const columnDef = [
		{
			colName: "Lớp tín chỉ",
			colDef: "credit_class_name",
		},
		{
			colName: "Năm học",
			colDef: "semester_name",
		},
		{
			colName: "Ca thi",
			colDef: "test_schedule_date",
		},
	];
	useEffect(() => {
		async function fetchData() {
			await getInitData();
		}
		fetchData();
	}, []);
	const [formData, setFormData] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "credit_class_id") {
			formData.test_schedule_id = "";
			const creditClass = creditClasses.filter((item) => item.id === value)[0];
			console.log(
				"on choose credit class",
				creditClass.semester_id,
				testSchedulesRef.current.filter((item) => item.semester_id === creditClass.semester_id),
			);
			setTestSchedules(testSchedulesRef.current.filter((item) => item.semester_id === creditClass.semester_id));
		}
		setFormData({ ...formData, [name]: value });
	};
	const initFormData = () => {
		if (test) {
			formData.test_id = test.id || "";
		}
	};

	const getCreditClasses = async () => {
		const response = await CreditClassService.getAllCreditClass();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			let creditClasses = response.data?.data;
			creditClasses = creditClasses.filter((creditClass) => creditClass.subject_id === test.subject_id);
			creditClasses = creditClasses.sort((a, b) => b.semester_id - a.semester_id);
			setCreditClasses(creditClasses);
		} else {
			toast.error("Không tìm thấy lớp tín chỉ.");
		}
	};
	async function getTestSchedule() {
		const response = await TestScheduleService.getAllTestSchedule();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			let testSchedules = response.data?.data;
			testSchedulesRef.current = testSchedules;
			//testSchedules = testSchedules.filter((testSchedule) => testSchedule.semester_id === test.semester_id);
			return setTestSchedules(testSchedules);
		} else {
			toast.error("Get test schedule failed");
			return [];
		}
	}
	const getTestClass = async (id) => {
		try {
			const response = await TestService.getAllTestClassByTestId(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const testClasses = response.data?.data;
				console.log("data", testClasses);
				testClasses.forEach((item) => {
					if (item.test_schedule_date) {
						item.test_schedule_date = FeHelpers.convertDateTime(item.test_schedule_date);
					}
				});
				setDataSource(testClasses);
			}
		} catch (err) {}
	};
	const handleSubmit = async (e) => {
		try {
			const listPrevent = ["id"];
			e.preventDefault();
			const errors = {};
			Object.keys(formData).forEach((item) => {
				if (!listPrevent.includes(item) && FeHelpers.isStringEmpty(formData[item])) {
					errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
				}
			});
			if (Object.keys(errors).length > 0) {
				setErrors(errors);
				return;
			}
			dataSource.forEach((item) => {
				if (formData.credit_class_id === item.credit_class_id && formData.test_schedule_id === item.test_schedule_id) {
					toast.error("Phân công đã tồn tại.");
					return;
				}
			});
			setLoading(true);
			if (formData.id.length === 0) formData.id = 0;
			const response = await TestService.createTestClass(formData);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Phân công thành công");
				await getTestClass(test?.id);
			}
		} catch (err) {
			toast.error("Phân công thất bại!");
			console.log("err: ", err);
		} finally {
			setLoading(false);
		}
	};
	async function handleDelete(data) {
		console.log(data);
		setTestClassRemove(data);
		setConfirmRemoveUserDialog(true);
	}

	async function handleConfirmDialog(data) {
		setConfirmRemoveUserDialog(false);
		try {
			if (data) {
				setLoading(true);
				const response = await TestService.deleteTestClass(testClassRemove?.id);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Hủy phân công thành công");
					await getTestClass(test?.id);
				} else {
					toast.error("Bài thi đã có ít nhất một kết quả, không thể hủy phân công.");
				}
			}
		} catch (err) {
			toast.error("Hủy phân công thất bại");
			console.log(err);
		} finally {
			setLoading(false);
		}
	}
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<hr />
				<div className="row text-header-container">
					<div className="w-7">Đề thi: {test.name}</div>
					<div className="w-3">
						Học kỳ {test.semester_semester}- Năm {test.semester_year}
					</div>
					<div className="mt-2">Môn học: {test.subject_name}</div>
				</div>
				<hr />
				<TextField
					select
					label="Lớp tín chỉ"
					variant="outlined"
					name="credit_class_id"
					value={formData.credit_class_id}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={Boolean(errors.credit_class_id)}>
					{creditClasses.length === 0 ? (
						<MenuItem key={"no-class-data"} value="">
							Không có dữ liệu
						</MenuItem>
					) : null}
					{creditClasses.map((creditClass, index) => (
						<MenuItem key={index} value={creditClass.id}>
							{creditClass.name} - {creditClass.class_code} - Học kỳ {creditClass.semester_semester} Năm học{" "}
							{creditClass.semester_year}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					label="Ca thi"
					variant="outlined"
					name="test_schedule_id"
					value={formData.test_schedule_id}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={Boolean(errors.test_schedule_id)}>
					{testSchedules.length === 0 ? (
						<MenuItem key={"no-test-schedule-data"} value="">
							Không có dữ liệu
						</MenuItem>
					) : null}
					{testSchedules.map((testSchedule, index) => (
						<MenuItem key={index} value={testSchedule.id}>
							{testSchedule.name} -- {FeHelpers.convertDateTime(testSchedule.date)}
						</MenuItem>
					))}
				</TextField>
				<Button type="submit" variant="contained" color="primary">
					Phân công
				</Button>
			</form>
			<h4 className="mt-3 mb-2">Danh sách đã phân công</h4>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}></CommonTableComponent>
			<CommonDialogComponent
				open={confirmRemoveUserDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleConfirmDialog}>
				<ConfirmDialog message="Bạn muốn hủy phân công này?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Container>
	);
}
