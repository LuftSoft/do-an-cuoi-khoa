import { useEffect, useState } from "react";
import { CommonTableComponent } from "../../components/Common";
import { ResultService } from "./ResultService";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { FeHelpers } from "../../utils/helpers";
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
	console.log(props);
	const { data } = props;
	const { loading, setLoading } = useLoadingService();
	const [dataSource, setDataSource] = useState([]);
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
	function handleView() {}
	return (
		<CommonTableComponent columnDef={columnDef} dataSource={dataSource} onView={handleView}></CommonTableComponent>
	);
}
