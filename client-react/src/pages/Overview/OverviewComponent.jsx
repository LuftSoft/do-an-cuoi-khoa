import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import "./Overview.css";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
const bull = (
	<Box component="span" sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
		•
	</Box>
);
const title = "Tổng quan";
const headInfo = [
	{
		name: "Nguoi dung",
		value: "",
	},
	{
		name: "Bai thi dang dien ra",
		value: "",
	},
	{
		name: "Cau hoi moi",
		value: "",
	},
	{
		name: "De thi moi trong ngay",
		value: "",
	},
];
export default function OverviewComponent() {
	const buttons = [
		{
			name: "Tạo lớp tín chỉ",
			onClick: handleButtonClick,
		},
	];
	function handleButtonClick() {}
	return (
		<Box>
			<div className="mb-3">
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<div className="card-container">
				{headInfo.map((data, index) => (
					<div className="card-item">
						<Card className="border-left">
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
							<CardActions>
								<Button size="small" color="primary" variant="outlined">
									<i className="fa-regular fa-flag"></i>Trang thai
								</Button>
								<Button size="small" color="primary" variant="contained">
									<i className="fa-solid fa-circle-info"></i>Chi tiet
								</Button>
							</CardActions>
						</Card>
					</div>
				))}
			</div>
			<div className="chart-container mt-3">
				<div className="chart-item-left">
					<Card>
						<CardContent></CardContent>
					</Card>
				</div>
				<div className="chart-item-right">
					<Card>
						<CardContent></CardContent>
					</Card>
				</div>
			</div>
		</Box>
	);
}
