import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import React from "react";
import "./CommonDialog.css";

const CommonDialogComponent = ({ open, onClose, width, height, children, title, icon }) => {
	function onCloseDialog() {
		onClose();
	}
	function handleSubmit(data) {
		//console.log("function is submitttt", data);
	}
	return (
		<Dialog open={open} onSubmit={handleSubmit} onClose={onClose} fullWidth={false} maxWidth={width || "sm"}>
			<div className="custom-dialog">
				<div className="title-contain">
					<h4>
						<i className={icon ? icon : ""}></i>
						{title ? title : ""}
					</h4>
					<CancelIcon className="cancel-icon" color="primary" onClick={onCloseDialog}></CancelIcon>
				</div>
				{children}
			</div>
		</Dialog>
	);
};

export default CommonDialogComponent;
