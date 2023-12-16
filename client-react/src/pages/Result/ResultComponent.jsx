import "./Result.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { TestScheduleService } from "../TestSchedule/TetsScheduleService";
import { TestService } from "../Test/TestService";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST, RESPONSE_MESSAGE } from "../../utils/const";
import { toast } from "react-toastify";
import { ResultService } from "./ResultService";
import { FeHelpers } from "../../utils/helpers";
import { Pagination } from "@mui/material";
import { CommonDialogComponent } from "../../components/Common";
import ResultDetailComponent from "./ResultDetailComponent";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import CommonFilterComponent from "../../components/Common/CommonFilter/CommonFilterComponent";
import { selectAccessToken } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { SubjectService } from "../Subject/SubjectService";

const bull = (
	<Box component="span" sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
		•
	</Box>
);

export default function ResultComponent() {
	const { loading, setLoading } = useLoadingService();
	const testClassesRef = useRef([]);
	const [testClasses, setTestClasses] = useState([]);
	const [testSchedules, setTestSchedules] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [results, setResults] = useState([]);
	const [openResultDetailDialog, setOpenResultDetailDialog] = useState(false);
	const accessToken = useSelector(selectAccessToken);
	const resultDetailDataRef = useRef(undefined);
	const filterRef = useRef({
		subject_id: "",
		year: "",
		semester: "",
	});
	const buttons = [];
	const [commonFilter, setCommonFilter] = useState({
		dropdowns: {
			subjectFilter: {
				placeholder: "Môn học",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleSubjectFilterChange,
			},
			yearFilter: {
				placeholder: "Năm học",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleYearFilterChange,
			},
			semesterFilter: {
				placeholder: "Học kỳ",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleSemesterFilterChange,
			},
		},
	});
	let commonFilterValue = useRef({
		subject: "",
		semester: "",
	});
	//init
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	async function getInitData() {
		setLoading(true);
		await getResults(accessToken);
		await getSubjects(accessToken);
		await getYears();
		await getSemesters();
		setLoading(false);
	}
	async function getResults(token) {
		const response = await ResultService.getAll(token);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setResults(response.data?.data);
		} else {
			toast.error(RESPONSE_MESSAGE.RESULT.GET_RESULT_ERROR);
			return [];
		}
	}

	async function getSubjects(token) {
		try {
			const response = await SubjectService.getSubjectDropdownByUserId(token);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.subjectFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: item.name, value: item.id });
				});
				opts.subjectFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	async function getYears() {
		try {
			const response = await ResultService.getAllSemesterYear();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.yearFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: `${item.year}-${item.year + 1}`, value: item.year });
				});
				opts.yearFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	async function getSemesters() {
		try {
			const response = await ResultService.getAllSemesters();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.semesterFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: `Học kỳ ${item.semester}`, value: item.semester });
				});
				opts.semesterFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	function onClose() {
		setOpenResultDetailDialog(false);
	}
	function handleResultDetail(item) {
		resultDetailDataRef.current = item;
		setOpenResultDetailDialog(true);
	}

	async function handleSubjectFilterChange(id) {
		filterRef.current = { ...filterRef.current, subject_id: id };
		console.log(filterRef.current);
		await handleFilter();
	}
	async function handleSemesterFilterChange(id) {
		filterRef.current = { ...filterRef.current, semester: id };
		console.log(filterRef.current);
		await handleFilter();
	}
	async function handleYearFilterChange(id) {
		filterRef.current = { ...filterRef.current, year: id };
		console.log(filterRef.current);
		await handleFilter();
	}
	const handleFilter = async () => {
		setLoading(true);
		try {
			const response = await ResultService.filterResult(filterRef.current, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setResults(response.data?.data);
			} else {
				toast.error(RESPONSE_MESSAGE.RESULT.FILTER_RESULT_ERROR);
			}
		} catch (err) {
			toast.error(RESPONSE_MESSAGE.RESULT.FILTER_RESULT_ERROR);
			console.log("err when filter", err);
		}
		setLoading(false);
	};
	return (
		<Box>
			<div className="mb-3">
				<TitleButtonComponent title={"Danh sách kết quả"} buttons={buttons} />
				<CommonFilterComponent search={null} dropdowns={commonFilter.dropdowns}></CommonFilterComponent>
			</div>
			<div className="result-container">
				{results.map((item, index) => (
					<Card className="result-card-container mb-2">
						<div className="row" key={index}>
							<div className="col-12">
								<CardContent className="pb-0">
									<Typography variant="h5" component="div">
										{item.test_name}
									</Typography>
									<Typography variant="body1" sx={{ mb: 0.5 }} style={styles.boldText}>
										<i className="fa-solid fa-book-open me-2"></i>
										{item.subject_name}
									</Typography>
									<Typography variant="body1" sx={{ mb: 0.5 }}>
										<i className="fa-solid fa-layer-group me-2" style={styles.boldText}></i>
										{item.credit_class_name}
									</Typography>
									<Typography variant="body1" sx={{ mb: 0.5 }}>
										<i className="fa-solid fa-clock me-2"></i>
										{FeHelpers.convertDateTime(item.test_schedule_date)}
										{bull} {item.test_time} (phút)
									</Typography>
									<Button size="small" color="primary" variant="outlined" style={{ pointerEvents: "none" }}>
										Số kết quả: <span style={{ fontWeight: "bold" }}>{item.result_count}</span>
									</Button>
								</CardContent>
							</div>
							<div className="col-12 d-flex justify-content-end mb-2">
								<CardActions>
									<Button size="small" color="primary" variant="contained" onClick={() => handleResultDetail(item)}>
										<i className="fa-solid fa-circle-info me-2"></i>Chi tiết kết quả
									</Button>
								</CardActions>
							</div>
						</div>
					</Card>
				))}
			</div>
			<CommonDialogComponent
				open={openResultDetailDialog}
				title="Chi tiết kết quả"
				icon="fa-solid fa-circle-plus"
				width="85vw"
				height="50vh"
				onClose={onClose}>
				<ResultDetailComponent data={resultDetailDataRef.current} />
			</CommonDialogComponent>
			{/* <Pagination className="mt-3 d-flex justify-content-end" count={10} variant="outlined" shape="rounded" /> */}
		</Box>
	);
}
const styles = {
	boldText: {
		fontWeight: "bold",
	},
};
