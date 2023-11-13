import "chart.js/auto";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import "./Overview.css";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { Bar, Chart, Pie } from "react-chartjs-2";
const bull = (
	<Box component="span" sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
		•
	</Box>
);
const title = "Tổng quan";
const headInfo = [
	{
		name: "Câu hỏi",
		value: "12",
	},
	{
		name: "Bài thi",
		value: "12",
	},
	{
		name: "Đề thi",
		value: "14",
	},
	{
		name: "Người sử dụng",
		value: "3",
	},
];
export default function OverviewComponent() {
	const buttons = [];
	const colors = ["#D6A2E8", "#FEA47F", "#3B3B98", "#f78fb3"];
	const chartData = {
		labels: [
			"HK2 2020",
			"HK3 2020",
			"HK1 2021",
			"HK2 2021",
			"HK3 2021",
			"HK1 2022",
			"HK2 2022",
			"HK3 2022",
			"HK1 2023",
			"HK2 2023",
		],
		datasets: [
			{
				label: "Số bài thi",
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(54, 162, 235, 0.6)",
				hoverBorderColor: "rgba(75,192,192,1)",
				data: [65, 59, 80, 81, 56, 34, 56, 85, 39, 102],
			},
		],
	};
	const pieData = {
		labels: ["Dưới 1", "1-4", "4-6.5", "6.5-8", "8-9", "Trên 9"],
		datasets: [
			{
				label: "Số bài thi",
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				hoverBackgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(153, 102, 255, 0.6)",
					"rgba(255, 159, 64, 0.6)",
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
									{data.value}
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
