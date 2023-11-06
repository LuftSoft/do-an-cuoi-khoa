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

export default function TestDetailComponent(props) {
	const test = props?.data;
	const [errors, setErrors] = useState({});
	const { loading, setLoading } = useLoadingService();
	const testSchedulesRef = useRef([]);
	const testDetailRef = useRef({});
	const [testDetails, setTestDetails] = useState({});
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
		await getTestDetail(test?.id);
		initFormData();
		setLoading(false);
	}
	const columnDef = [
		{
			colName: "Câu hỏi",
			colDef: "question",
		},
		{
			colName: "Độ khó",
			colDef: "level",
		},
		{
			colName: "Chương",
			colDef: "chapter_name",
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
	async function getTestDetail(id) {
		const response = await TestService.getOneTest(id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			let testDetail = response.data?.data;
			testDetail.questions = testDetail.questions.sort((a, b) => b.id - a.id);
			testDetail.questions.forEach((item) => {
				item.className = {};
				switch (item?.level) {
					case CONST.QUESTION.LEVEL[0]:
						item.level = "DỄ";
						item.className.level = "bg-easy";
						break;
					case CONST.QUESTION.LEVEL[1]:
						item.level = "VỪA";
						item.className.level = "bg-medium";
						break;
					case CONST.QUESTION.LEVEL[2]:
						item.level = "KHÓ";
						item.className.level = "bg-difficult";
						break;
				}
			});
			setTestDetails(testDetail);
			testDetailRef.current = testDetail || {};
		} else {
			toast.error("Không tìm thấy đề thi.");
		}
	}
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
					<div className="mt-2 row">
						<div className="w-2">Số câu hỏi: {test.easy_question + test.medium_question + test.difficult_question}</div>
						<div className="w-2">Câu hỏi dễ: {test.easy_question}</div>
						<div className="w-2">Câu hỏi vừa: {test.medium_question}</div>
						<div className="w-2">Câu hỏi khó: {test.difficult_question}</div>
					</div>
				</div>
				<hr />
			</form>
			<div className="d-flex mt-3 mb-2 position-relative">
				<h4 className="w-8">Danh sách câu hỏi</h4>
				<Button type="submit" variant="contained" color="primary" className="position-absolute end-0">
					Thêm câu hỏi
				</Button>
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={testDetails.questions || []}
				onDelete={handleDelete}></CommonTableComponent>
			<CommonDialogComponent
				open={confirmRemoveUserDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleConfirmDialog}>
				<ConfirmDialog
					message="Bạn muốn xóa câu hỏi này khỏi đề thi?"
					handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Container>
	);
}
