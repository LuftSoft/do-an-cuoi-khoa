import { Autocomplete, Container, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
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
import { ResultService } from "../Result/ResultService";

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

export default function TestTakeComponent({ type = "result" | "test", data }) {
	const [errors, setErrors] = useState({});
	const { loading, setLoading } = useLoadingService();
	const testSchedulesRef = useRef([]);
	const [creditClasses, setCreditClasses] = useState([]);
	const [dataSource, setDataSource] = useState({ detail: [] });
	async function getInitData() {
		setLoading(true);
		switch (type) {
			case "result":
				await getResultDetail();
			case "test":
				await getTestDetail();
		}
		setLoading(false);
	}
	useEffect(() => {
		async function fetchData() {
			await getInitData();
		}
		fetchData();
	}, []);
	const [formData, setFormData] = useState(initialValues);
	async function getResultDetail() {
		const response = await ResultService.getById(data?.id);
		if (response?.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setDataSource(response.data?.data);
		}
	}

	async function getTestDetail() {
		const response = await TestService.getOneTest(data.id);
		if (response?.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setDataSource(response.data?.data);
		}
	}
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

	const handleChooseChange = (e) => {
		console.log(e.target.value);
	};
	function getAnswerColor(choose, answer, correct_answer) {
		if (choose === answer && answer === correct_answer) {
			return "correct-answer";
		} else if (answer === correct_answer) {
			return "correct-answer";
		} else if (choose === answer) {
			return "wrong-answer";
		}
		return null;
	}
	return (
		<div>
			{type === "result" ? (
				//result mode here.
				<div className="row w-100" style={{ height: 500 }}>
					<div className="col-md-10 col-sm-12 q-test-item" style={{}}>
						{dataSource.detail.map((item, index) => (
							<div style={{ margin: "0 16px" }}>
								<Typography fontWeight="700" fontSize="16px">
									Câu {index + 1}:
								</Typography>
								<Typography fontSize="16px">{item.question}</Typography>
								<RadioGroup
									value={item.choose}
									aria-labelledby="demo-radio-buttons-group-label"
									name={`question_${index}`}>
									<FormControlLabel
										value="answer_a"
										className={getAnswerColor(item.choose, "answer_a", item.correct_answer)}
										control={<Radio className="red" />}
										label={item.answer_a}
									/>
									<FormControlLabel
										value="answer_b"
										className={getAnswerColor(item.choose, "answer_b", item.correct_answer)}
										control={<Radio />}
										label={item.answer_b}
									/>
									<FormControlLabel
										value="answer_c"
										className={getAnswerColor(item.choose, "answer_c", item.correct_answer)}
										control={<Radio />}
										label={item.answer_c}
									/>
									<FormControlLabel
										value="answer_d"
										className={getAnswerColor(item.choose, "answer_d", item.correct_answer)}
										control={<Radio />}
										label={item.answer_d}
									/>
								</RadioGroup>
								<hr className="mt-4 mb-2" />
							</div>
						))}
					</div>
					<div className="col-md-2 col-sm-12 q-test-item" style={{}}>
						<Typography variant="body1">Thời gian bắt đầu: {data.start_time}</Typography>
						<Typography variant="h5" className="mark-field mb-3" align="center">
							Điểm số: {data.mark}/{dataSource.total_mark || 0}
						</Typography>
						<hr />
						<Typography variant="h6">Bảng chọn đáp án</Typography>
						<div className="q-process-container">
							{dataSource.detail?.map((item, index) => (
								<span
									className={
										item.choose.trim().length === 0 ? "q-process-node" : "q-process-node q-process-node-selected"
									}>
									{index + 1}
								</span>
							))}
						</div>
					</div>
				</div>
			) : (
				// test mode here
				<div className="row" style={{ height: 500 }}>
					<div className="col-md-10 col-sm-12 q-test-item" style={{}}>
						{dataSource.detail?.map((item, index) => (
							<div style={{ margin: "0 16px" }}>
								<Typography variant="h6">Câu {index + 1}:</Typography>
								<Typography variant="body1">{item.question}</Typography>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name={`question_${index}`}
									onChange={handleChooseChange}>
									<FormControlLabel value="answer_a" control={<Radio color="error" />} label={item.answer_a} />
									<FormControlLabel value="answer_b" control={<Radio />} label={item.answer_b} />
									<FormControlLabel value="answer_c" control={<Radio />} label={item.answer_c} />
									<FormControlLabel value="answer_d" control={<Radio />} label={item.answer_d} />
								</RadioGroup>
								<hr />
							</div>
						))}
					</div>
					<div className="col-md-2 col-sm-12 q-test-item" style={{}}>
						<Typography variant="body1">Thoi gian con lai</Typography>
						<Typography variant="h5">12:12</Typography>
						<Button color="primary" variant="outlined">
							NOP BAI
						</Button>
						<div className="q-process-container">
							<span className="q-process-node">1</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
