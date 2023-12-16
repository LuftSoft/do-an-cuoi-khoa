import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { UserComponent, UserSubjectComponent } from ".";
import { selectUser } from "../../redux/selectors";
import { useRouteGuard } from "../../utils/route.guard";
import { FeHelpers } from "../../utils/helpers";
import { CONST } from "../../utils/const";

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

export default function UserLayoutComponent() {
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	useRouteGuard(["admin", "gv"], permissions);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<Box>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Tài khoản" {...genIndex(0)} />
					<Tab label="Quản lý bộ câu hỏi" {...genIndex(1)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<UserComponent></UserComponent>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<UserSubjectComponent></UserSubjectComponent>
			</CustomTabPanel>
		</Box>
	);
}
