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
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	async function getInitData() {
		setLoading(true);
		await getResultDetail(data?.id);
		setLoading(false);
	}
	async function getResultDetail(id) {
		const response = await ResultService.getByCreditClassesId(id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			const data = response.data?.data;
			data.forEach((item) => {
				if (item.start_time) {
					item.start_time = FeHelpers.convertDate(item.start_time);
				}
			});
			setDataSource(data);
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
		<Box>
			<div className="my-2 mx-4 d-flex justify-content-end">
				<Button type="submit" variant="contained" color="success" onClick={() => handleExportTranscript(data?.id)}>
					<i className="fa-solid fa-file-export me-2"></i> Xuất bảng điểm
				</Button>
			</div>
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
		</Box>
	);
}
