import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import "./CommonFilter.css";
import { FeHelpers } from "../../../utils/helpers";
import { keyframes } from "@emotion/react";
export default function CommonListComponent({
	data,
	handleChange,
	search,
	title,
	paramKey,
	paramValue,
	isAdd,
	handleAdd,
	isDelete,
	handleDelete,
}) {
	const [selectedItem, setSelectedItem] = useState(null);
	const [tmpData, setTmpData] = useState(FeHelpers.cloneDeep(data));
	function handleItemClick(item) {
		setSelectedItem(item[paramKey]);
		handleChange(item);
	}
	let val = "";
	function isSelected(item) {
		return item[paramKey] === selectedItem;
	}
	useEffect(() => {
		setTmpData(FeHelpers.cloneDeep(data));
	}, [data]);
	function handleSearchChange(e) {
		if (e.target.value.trim().length === 0) {
			setTmpData(FeHelpers.cloneDeep(data));
		}
		setTmpData(
			data.filter(
				(item) =>
					FeHelpers.chuanhoadaucau(item[paramValue].trim().toLowerCase()).includes(
						FeHelpers.chuanhoadaucau(e.target.value.trim().toLowerCase()),
					) ||
					FeHelpers.chuanhoadaucau(e.target.value.trim().toLowerCase()).includes(
						FeHelpers.chuanhoadaucau(item[paramValue].trim().toLowerCase()),
					),
			),
		);
	}
	return (
		<Box style={styles.container}>
			<ul className="list-group list-group-flush w-100">
				<li
					className="list-group-item"
					style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					{title || "Danh sách"}
					{isAdd ? <i className="fa-solid fa-plus" style={{ cursor: "pointer" }} onClick={handleAdd}></i> : null}
				</li>
				<input
					type="text"
					className="form-control"
					onChange={(e) => handleSearchChange(e)}
					placeholder="Tìm kiếm..."
					style={{ margin: "5px 0" }}
				/>
				{tmpData.map((item, index) => (
					<li
						key={`${item[paramKey]}_${index}`}
						id={`${item[paramKey]}_${index}`}
						style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
						className={
							isSelected(item)
								? "list-group-item list-group-item-action active"
								: "list-group-item list-group-item-action"
						}
						onClick={() => handleItemClick(item)}>
						{item[paramValue] || ""}
						{isDelete ? (
							<i
								className="fa-solid fa-trash-can"
								style={{ cursor: "pointer" }}
								onClick={(e) => handleDelete(item)}></i>
						) : null}
					</li>
				))}
			</ul>
		</Box>
	);
}
const styles = {
	container: {
		borderRadius: "4px",
		width: "100%",
		boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "10px",
		borderBottom: "1px solid #ccc",
		textTransform: "uppercase",
	},
	title: {
		flex: 1,
		fontWeight: "bold",
	},
	filterContain: {
		display: "flex",
		justifyContent: "flex-end",
	},
};
