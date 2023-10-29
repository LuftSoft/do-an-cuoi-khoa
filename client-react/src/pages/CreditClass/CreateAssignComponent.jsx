import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { FeHelpers } from "../../utils/helpers";
import { SubjectService } from "../Subject/SubjectService";
import { QuestionService } from "../Question/QuestionService";
import { SemesterService } from "../Semesters/SemesterService";
import { CreditClassService } from "./CreditClassService";
import { UserService } from "../User/UserService";

const initialValues = {
	user_id: "",
	credit_class_id: "",
};

const QUANTITY = {
	MIN: 1,
	MAX: 1000,
};

export default function CreateAssignComponent({ onSubmit }) {
	const [errors, setErrors] = useState({});
	const loadingService = useLoadingService();
	const [users, setUsers] = useState([]);
	async function getInitData() {
		loadingService.setLoading(true);
		await getUsers();
		loadingService.setLoading(false);
	}
	useEffect(() => {
		async function fetchData() {
			await getInitData();
		}
		fetchData();
	}, []);
	const [formData, setFormData] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const getUsers = async () => {
		const response = await UserService.getAllGV();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setUsers(response.data?.data);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		Object.keys(formData).forEach((item) => {
			if (FeHelpers.isStringEmpty(formData[item])) {
				errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
			}
		});
		// console.log(formData);
		// console.log(errors);
		if (Object.keys(errors).length > 0) {
			console.log(errors);
			setErrors(errors);
			return;
		}
	};

	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					select
					label="Lớp tín chỉ"
					variant="outlined"
					name="credit_class_id"
					value={formData.credit_class_id}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{users.map((user, index) => (
						<MenuItem keuser={index} value={user.id}>
							{user.firstName} {user.lastName}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					label="Giảng viên"
					variant="outlined"
					name="user_id"
					value={formData.user_id}
					onChange={handleChange}
					fullWidth
					margin="normal">
					{users.map((user, index) => (
						<MenuItem keuser={index} value={user.id}>
							{user.firstName} {user.lastName}
						</MenuItem>
					))}
				</TextField>
				<Button type="submit" variant="contained" color="primary">
					Phân công
				</Button>
			</form>
		</Container>
	);
}
