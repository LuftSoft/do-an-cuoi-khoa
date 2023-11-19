import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { QuestionService } from "./QuestionService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";

export default function ImportDialogComponent(props) {
	const [file, setFile] = useState(null);
	const [errors, setErrors] = useState({});
	const user = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
	};
	function handleSubmit() {
		if (!file) {
			setErrors({ file: true });
			return;
		}
		QuestionService.importQuestion({ file: file }, accessToken);
	}
	return (
		<Box>
			<div style={{ padding: "0 24px" }}>
				<TextField
					variant="outlined"
					name="avatar"
					label="Chọn file"
					onChange={handleFileChange}
					fullWidth
					type="file"
					error={errors.file}
					margin="normal"
					inputProps={{ accept: ".xls,.xlsx" }}
					InputLabelProps={{ shrink: true }}
				/>
				<div className="mb-3 mt-1">
					<Button onClick={handleSubmit} variant="contained" color="primary" className="px-4">
						<i className="fa-solid fa-floppy-disk me-2"></i> Import
					</Button>
				</div>
			</div>
		</Box>
	);
}
