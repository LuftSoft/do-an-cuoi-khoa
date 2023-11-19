import { useEffect, useState } from "react";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { ResultService } from "./ResultService";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { FeHelpers } from "../../utils/helpers";
import TestTakeComponent from "../Test/TestTakeComponent";
import { Box } from "@mui/material";
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
	return (
		<Box>
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
