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
	const resultDetailDataRef = useRef(undefined);
	//init
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	async function getInitData() {
		setLoading(true);
		await getResults();
		setLoading(false);
	}
	async function getResults() {
		const response = await ResultService.getAll();
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
	return (
		<Box>
			{results.map((item, index) => (
				<Card className="result-card-container mb-2">
					<div className="row" key={index}>
						<div className="col-8">
							<CardContent>
								<Typography variant="h5" component="div">
									{item.test_name}
								</Typography>
								<Typography variant="body1" sx={{ mb: 0.5 }}>
									<i className="fa-solid fa-book-open me-2"></i>Môn học: {item.subject_name}
								</Typography>
								<Typography variant="body1" sx={{ mb: 0.5 }}>
									<i className="fa-solid fa-layer-group me-2"></i>LTC: {item.credit_class_name}
								</Typography>
								<Typography variant="body1">
									<i className="fa-solid fa-clock me-2"></i>
									{FeHelpers.convertDateTime(item.test_schedule_date)}
									{bull} {item.test_time}(phút)
								</Typography>
							</CardContent>
						</div>
						<div className="col-4">
							<CardActions>
								<Button size="small" color="primary" variant="outlined">
									<i className="fa-regular fa-flag me-2"></i>Trang thai
								</Button>
								<Button size="small" color="primary" variant="contained" onClick={() => handleResultDetail(item)}>
									<i className="fa-solid fa-circle-info me-2"></i>Chi tiet
								</Button>
							</CardActions>
						</div>
					</div>
				</Card>
			))}
			<CommonDialogComponent
				open={openResultDetailDialog}
				title="Chi tiết kết quả"
				icon="fa-solid fa-circle-plus"
				width="70vw"
				height="50vh"
				onClose={onClose}>
				<ResultDetailComponent data={resultDetailDataRef.current} />
			</CommonDialogComponent>
			<Pagination className="mt-3 d-flex justify-content-end" count={10} variant="outlined" shape="rounded" />
		</Box>
	);
}
