import Button from "@mui/material/Button";
import "./CommonDialog.css";

export default function ConfirmDialog(props) {
	const { message, btnYes, btnNo, handleClose } = props;
	return (
		<div className="confirm-container">
			<h4 className="confirm-msg">{message || "Xác nhận"}</h4>
			<div className="confirm-btn-container">
				<Button onClick={() => handleClose(true)} variant="contained" color="primary">
					{btnYes || "Đồng ý"}
				</Button>
				<Button onClick={() => handleClose(false)} type="submit" variant="contained" color="error">
					{btnNo || "Hủy"}
				</Button>
			</div>
		</div>
	);
}
