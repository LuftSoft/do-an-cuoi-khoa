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
export default function CommonFilterComponent({ search, dropdowns }) {
	const [dropdowns$, setDropdowns$] = useState(dropdowns);
	const [search$, setSearch$] = useState(search);
	const [searchValue, setSearchValue] = useState(null);
	useEffect(() => {
		console.log("dropdowns change", dropdowns);
		setDropdowns$(dropdowns);
	}, [dropdowns]);
	function handleFilterChange(item, e) {
		const tmp = JSON.parse(JSON.stringify(dropdowns$));
		tmp[item].value = e.target.value;
		setDropdowns$(tmp);
		dropdowns[item].handleChange(e.target.value);
	}
	function handleSearchChange(e) {
		setSearchValue(e.target.value);
	}
	function handleSearchKeySubmit(e) {
		if ((e && e.key === "Enter") || e.target.value.length === 0) {
			search.handleChange(searchValue);
		}
	}
	function handleSearchSubmit() {
		search.handleChange(searchValue);
	}
	let val = "";
	return (
		<Box style={styles.container}>
			{search ? (
				<div className="common_filter-search-container">
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder={search?.title || "Search"}
						inputProps={{ "aria-label": "search" }}
						onChange={handleSearchChange}
						onKeyUp={handleSearchKeySubmit}
					/>
					<IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearchSubmit}>
						<SearchIcon />
					</IconButton>
				</div>
			) : null}
			<div style={styles.filterContain}>
				{Object.keys(dropdowns$).map((item, index) => (
					<FormControl sx={{ m: 1, minWidth: 180, width: "fit-content" }} size="small">
						<InputLabel id="demo-select-small-label">{dropdowns$[item]?.placeholder || "Thanh chọn"}</InputLabel>
						<Select
							labelId="demo-select-small-label"
							id="demo-select-small"
							value={dropdowns$[item]?.value}
							onChange={(e) => {
								handleFilterChange(item, e);
							}}>
							{dropdowns$[item]?.options?.map((opt) => (
								<MenuItem value={opt.value}>{opt.key}</MenuItem>
							))}
						</Select>
					</FormControl>
				))}
			</div>
		</Box>
	);
}
const styles = {
	container: {
		borderRadius: "4px",
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
		flex: 1,
		display: "flex",
		justifyContent: "flex-end",
	},
};
