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
import { CONST } from "../../utils/const";
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
	const [results, setResults] = useState([]);
	const [openResultDetailDialog, setOpenResultDetailDialog] = useState(false);
	const accessToken = useSelector(selectAccessToken);
	const resultDetailDataRef = useRef(undefined);
	const buttons = [
		// {
		// 	name: "Tạo câu hỏi",
		// 	icon: "fa-solid fa-plus",
		// 	onClick: handleButtonClick,
		// 	color: CONST.BUTTON.COLOR.PRIMARY,
		// },
	];
	const [commonFilter, setCommonFilter] = useState({
		// search: {
		// 	title: "Tìm kiếm câu hỏi",
		// 	handleChange: handleSearchQuestion,
		// },
		dropdowns: {
			subjectFilter: {
				placeholder: "Môn học",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleSubjectFilterChange,
			},
			levelFilter: {
				placeholder: "Học kỳ",
				value: "",
				options: [
					{ key: "Tất cả", value: "ALL" },
					{ key: "Dễ", value: "EASY" },
					{ key: "Vừa", value: "MEDIUM" },
					{ key: "Khó", value: "DIFFICULT" },
				],
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
		setLoading(false);
	}
	async function getResults(token) {
		const response = await ResultService.getAll(token);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setResults(response.data?.data);
		} else {
			toast.error("Get all result failed");
			return [];
		}
	}
	async function getTestSchedules() {
		const response = await TestScheduleService.getAllTestSchedule();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			let testSchedules = response.data?.data;
			return setTestSchedules(testSchedules);
		} else {
			toast.error("Get test schedule failed");
			return [];
		}
	}
	async function getTestClass() {
		try {
			const response = await TestService.getAllTestClass();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				console.log("success");
				setTestClasses(response.data?.data);
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

	function handleSubjectFilterChange(id) {
		commonFilterValue.current.subject = id;
		handleFilter();
	}
	function handleSemesterFilterChange(id) {
		commonFilterValue.current.semester = id;
		handleFilter();
	}
	const handleFilter = () => {
		console.log("commonFasdasdilterValue", commonFilterValue);
		setLoading(true);
		//let questionsTmp = FeHelpers.cloneDeep(questionRef.current);
		try {
			// let searchRef = commonFilterValue.current.search;
			// let subjectRef = commonFilterValue.current.subject;
			// let levelRef = commonFilterValue.current.level;
			// if (searchRef !== null && searchRef.length > 0) {
			// 	questionsTmp = questionsTmp.filter(
			// 		(item) =>
			// 			FeHelpers.chuanhoadaucau(item.question).toLowerCase().includes(searchRef) ||
			// 			FeHelpers.chuanhoadaucau(item.subject_name).toLowerCase().includes(searchRef),
			// 	);
			// }
			// if (subjectRef !== null && subjectRef.length > 0) {
			// 	questionsTmp = questionsTmp.filter((item) => item.subject_id === subjectRef);
			// }
			// if (levelRef !== null && levelRef.length > 0) {
			// 	questionsTmp = questionsTmp.filter((item) => item.level === levelRef);
			// }
			// setDataSource(questionsTmp);
		} catch (err) {
			console.log("err when filter", err);
		}
		setTimeout(() => {
			setLoading(false);
		}, 500);
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
