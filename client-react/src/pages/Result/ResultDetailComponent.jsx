import { useState } from "react";
import { CommonTableComponent } from "../../components/Common";
const columnDef = [
	{
		colName: "Nội dung",
		colDef: "question",
	},
	{
		colName: "Môn học",
		colDef: "subject_name",
	},
	{
		colName: "Chương",
		colDef: "chapter_name",
	},
	{
		colName: "Độ khó",
		colDef: "level",
	},
];
export default function ResultDetailComponent(props) {
	console.log(props);
	const [dataSource, setDataSource] = useState([]);
	function handleView() {}
	return (
		<CommonTableComponent columnDef={columnDef} dataSource={dataSource} onView={handleView}></CommonTableComponent>
	);
}
