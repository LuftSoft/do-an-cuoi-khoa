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
	//init
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	async function getInitData() {
		setLoading(true);
		await getTestClass();
		setLoading(false);
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
	return (
		<Box>
			{testClasses.map((testClass, index) => (
				<Card className="result-card-container mb-2">
					<div className="row" key={index}>
						<div className="col-8">
							<CardContent>
								<Typography variant="h5" component="div">
									Ten cua de thi o day{bull}
								</Typography>
								<Typography variant="body2">
									<i className="fa-solid fa-book-open"></i>Ten mon hoc
								</Typography>
								<Typography sx={{ mb: 1.5 }} color="text.secondary">
									<i className="fa-solid fa-layer-group"></i>Duoc giao cho lop tin chi nao
								</Typography>
								<Typography variant="body2">
									<i className="fa-solid fa-clock"></i>Thoi gian lam bai
								</Typography>
							</CardContent>
						</div>
						<div className="col-4">
							<CardActions>
								<Button size="small" color="primary" variant="outlined">
									<i className="fa-regular fa-flag"></i>Trang thai
								</Button>
								<Button size="small" color="primary" variant="contained">
									<i className="fa-solid fa-circle-info"></i>Chi tiet
								</Button>
							</CardActions>
						</div>
					</div>
				</Card>
			))}
		</Box>
	);
}
