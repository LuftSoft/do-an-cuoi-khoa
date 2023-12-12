import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import { useRouteGuard } from "../../utils/route.guard";
import ResultComponent from "./ResultComponent";
import StatComponent from "./StatComponent";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function genIndex(index) {
	return {
		id: `tab-${index}`,
		"aria-controls": `tab-panel-${index}`,
	};
}

export default function ResultLayoutComponent() {
	const permissions = useSelector(selectUser).permissions[0] || [];
	useRouteGuard(["gv"], permissions);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<Box>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Kết quả" {...genIndex(0)} />
					{/* <Tab label="Thống kê" {...genIndex(1)} /> */}
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<ResultComponent></ResultComponent>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<StatComponent></StatComponent>
			</CustomTabPanel>
		</Box>
	);
}
