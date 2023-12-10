import "chart.js/auto";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import "./Overview.css";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { Bar, Chart, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { OverviewService } from "./OverviewService";
import { CONST } from "../../utils/const";
import { useLoadingService } from "../../contexts/loadingContext";
const bull = (
	<Box component="span" sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
		•
	</Box>
);
const title = "Tổng quan";
const headInfo = [
	{
		name: "Câu hỏi",
		key: "questions",
	},
	{
		name: "Đề thi",
		key: "tests",
	},
	{
		name: "Lượt thi",
		key: "results",
	},
	{
		name: "Người sử dụng",
		key: "users",
	},
];
export default function OverviewComponent() {
	const [fourTopData, setFourTop] = useState({
		questions: 0,
		tests: 0,
		users: 0,
		results: 0,
	});
	const [pieChartData, setPieChart] = useState({
		under_one: 0,
		one_four: 0,
		four_six_point_five: 0,
		six_point_five_eight: 0,
		eight_nine: 0,
		above_nine: 0,
	});
	const [barChartData, setBarChart] = useState([]);
	const { loading, setLoading } = useLoadingService();
	const buttons = [];
	const colors = ["#D6A2E8", "#FEA47F", "#3B3B98", "#f78fb3"];
	const chartData = {
		labels: barChartData.map((i) => `HK${i.semester} ${i.year}`).reverse(),
		datasets: [
			{
				label: "Số bài thi",
				backgroundColor: "rgba(54, 162, 235, 0.8)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(54, 162, 235, 1)",
				hoverBorderColor: "rgba(75,192,192,1)",
				data: barChartData.map((i) => i.num).reverse(),
			},
		],
	};
	const pieData = {
		labels: ["Dưới 1", "1-4", "4-6.5", "6.5-8", "8-9", "Trên 9"],
		datasets: [
			{
				label: "Số bài thi",
				data: Object.values(pieChartData),
				backgroundColor: [
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)",
				],
				hoverBackgroundColor: [
					"rgba(255, 99, 132)",
					"rgba(54, 162, 235)",
					"rgba(255, 206, 86)",
					"rgba(75, 192, 192)",
					"rgba(153, 102, 255)",
					"rgba(255, 159, 64)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	const getFourTopInfo = async () => {
		const response = await OverviewService.getFourTopInfo();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setFourTop(response.data?.data);
		}
	};
	const getPieChartInfo = async () => {
		const response = await OverviewService.getPieChartInfo();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setPieChart(response.data?.data);
		}
	};
	const getBarChartInfo = async () => {
		const response = await OverviewService.getBarChartInfo();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setBarChart(response.data?.data);
		}
	};
	const getInitData = async () => {
		setLoading(true);
		await getFourTopInfo();
		await getPieChartInfo();
		await getBarChartInfo();
		setLoading(false);
	};
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	function handleButtonClick() {}
	return (
		<Box>
			<div className="mb-3">
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<div className="overview-card-container">
				{headInfo.map((data, index) => (
					<div className="overview-card-item">
						<Card className="overview-border-left" style={{ backgroundColor: colors[index] }}>
							<CardContent>
								<Typography variant="h4" component="div" color="white" style={{ fontWeight: 600 }}>
									{fourTopData[data.key]}
								</Typography>
								<Typography variant="h5" color="white">
									{data.name}
								</Typography>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
			<div className="chart-container mt-3">
				<div className="chart-item-left">
					<Card style={{ height: "100%" }}>
						<CardContent style={{ height: "100%" }}>
							<Chart type="bar" data={chartData} title="Số bài thi" />
						</CardContent>
					</Card>
				</div>
				<div className="chart-item-right">
					<Card style={{ height: "100%" }}>
						<CardContent style={{ height: "100%" }}>
							<Chart type="pie" data={pieData} title="Thống kê điểm" />
						</CardContent>
					</Card>
				</div>
			</div>
		</Box>
	);
}
