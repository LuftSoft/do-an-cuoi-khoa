import { useEffect, useState } from "react";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { ResultService } from "./ResultService";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { FeHelpers } from "../../utils/helpers";
import TestTakeComponent from "../Test/TestTakeComponent";
import { Box, Button } from "@mui/material";
import { Chart } from "react-chartjs-2";
const columnDef = [
	{
		colName: "Mã sinh viên",
		colDef: "user_code",
	},
	{
		colName: "Tên sinh viên",
		colDef: "user_name",
	},
	{
		colName: "Bắt đầu",
		colDef: "start_time",
	},
	{
		colName: "Điểm",
		colDef: "mark",
	},
];
export default function ResultDetailComponent(props) {
	const { data } = props;
	const { loading, setLoading } = useLoadingService();
	const [dataSource, setDataSource] = useState([]);
	const [openTestTakeDialog, setOpenTestTakeDialog] = useState(false);
	const [resultDialogData, setResultDialogData] = useState(null);
	const [barChartData, setBarChartData] = useState([]);
	const [statisticalData, setStatisticalData] = useState({});
	const chartData = {
		labels: barChartData.map((i) => `${i.mark}`),
		datasets: [
			{
				label: "Số bài thi",
				backgroundColor: "rgba(54, 162, 235, 0.8)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(54, 162, 235, 1)",
				hoverBorderColor: "rgba(75,192,192,1)",
				data: barChartData.map((i) => i.quantity),
			},
		],
	};
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	async function getInitData() {
		setLoading(true);
		await getResultDetail(data?.id);
		await getResultChartDetail(data?.id);
		setLoading(false);
	}
	async function getResultDetail(id) {
		const response = await ResultService.getByCreditClassesId(id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			const data = response.data?.data;
			data.forEach((item) => {
				if (item.start_time) {
					item.start_time = FeHelpers.convertDateTime(item.start_time);
				}
			});
			setDataSource(data);
		} else {
			toast.error("Get all result failed");
			return [];
		}
	}
	async function getResultChartDetail(id) {
		const response = await ResultService.getChartByCreditClassesId(id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setBarChartData(response.data?.data?.barChartData || []);
			setStatisticalData(response.data?.data?.statisticalData || {});
		} else {
			toast.error("Get all result failed");
			return [];
		}
	}
	function handleView(data) {
		setResultDialogData(data);
		setOpenTestTakeDialog(true);
	}
	function handleCloseDialog() {
		setOpenTestTakeDialog(false);
	}
	async function handleExportTranscript(id) {
		const response = await ResultService.exportTranscript(id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			const pdfBuffer = atob(response.data?.data);
			const byteNumbers = new Array(pdfBuffer.length);
			for (let i = 0; i < pdfBuffer.length; i++) {
				byteNumbers[i] = pdfBuffer.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: "application/pdf" });

			// Create a download link
			const link = document.createElement("a");
			link.setAttribute("target", "_blank");
			link.href = window.URL.createObjectURL(blob);
			//link.download = `bang_diem_export_${new Date().getTime().toString()}.pdf`;
			document.body.appendChild(link);

			// Trigger the download
			link.click();

			// Clean up
			document.body.removeChild(link);
			toast.success("Xuất bảng điểm thành công");
		}
	}
	return (
		<div style={{ marginLeft: 24, marginRight: 24 }}>
			<div className="my-2 mx-4 d-flex justify-content-end">
				{/* <Button type="submit" variant="contained" color="success" onClick={() => handleExportTranscript(data?.id)}>
					<i className="fa-solid fa-file-export me-2"></i> Xuất bảng điểm
				</Button> */}
			</div>
			<div className="d-flex justify-content-center">
				<div className="mt-2 w-7">
					<Chart type="bar" data={chartData} title="Phổ điểm" />
					<p className="my-2" style={{ fontStyle: "italic", textAlign: "center" }}>
						Biểu đồ phổ điểm kết quả
					</p>
				</div>
			</div>
			<table class="table caption-top my-2">
				<thead>
					<tr style={{ textAlign: "center" }}>
						<th scope="col">Điểm cao nhất</th>
						<th scope="col">Điểm thấp nhất</th>
						<th scope="col">Điểm trung bình</th>
						<th scope="col">Số bài thi trên trung bình</th>
					</tr>
				</thead>
				<tbody>
					<tr style={{ textAlign: "center" }}>
						<td>{statisticalData.max_mark}</td>
						<td>{statisticalData.min_mark}</td>
						<td>{statisticalData.avg_mark}</td>
						<td>{statisticalData.above_avg_mark}</td>
					</tr>
				</tbody>
			</table>
			<p className="my-2" style={{ fontWeight: "bold" }}>
				Danh sách kết quả làm bài thi
			</p>
			<CommonTableComponent columnDef={columnDef} dataSource={dataSource} onView={handleView}></CommonTableComponent>
			<CommonDialogComponent
				open={openTestTakeDialog}
				onClose={handleCloseDialog}
				title="Chi tiết kết quả"
				width="80vw"
				height="auto"
				icon="fa-solid fa-circle-info">
				<TestTakeComponent data={resultDialogData} type="result"></TestTakeComponent>
			</CommonDialogComponent>
		</div>
	);
}
