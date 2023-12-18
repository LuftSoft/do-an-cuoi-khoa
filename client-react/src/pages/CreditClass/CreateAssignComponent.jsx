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
import "./CreditClass.css";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";

const initialValues = {
	id: "",
	user_id: "",
	credit_class_id: "",
};

const QUANTITY = {
	MIN: 1,
	MAX: 1000,
};

export default function CreateAssignComponent(props) {
	const [errors, setErrors] = useState({});
	const { loading, setLoading } = useLoadingService();
	const [users, setUsers] = useState([]);
	const [creditClasses, setCreditClasses] = useState([]);
	const [dataSource, setDataSource] = useState([]);
	const [userRemove, setUserRemove] = useState({});
	const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
	async function getInitData() {
		setLoading(true);
		await getUsers();
		await getCreditClasses();
		await getClassAssign();
		initFormData();
		setLoading(false);
	}
	const columnDef = [
		{
			colName: "Tên giảng viên",
			colDef: "name",
		},
		{
			colName: "Mã nhân viên",
			colDef: "user_code",
		},
	];
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
	const initFormData = () => {
		if (props?.data) {
			formData.credit_class_id = props.data.id || "";
		}
	};
	const getUsers = async () => {
		const response = await CreditClassService.getAllGVForCreditClassId(props?.data?.id);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setUsers(response.data?.data);
		}
	};
	const getCreditClasses = async () => {
		const response = await CreditClassService.getAllCreditClass();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			setCreditClasses(response.data?.data);
		} else {
			toast.error("Không tìm thấy lớp tín chỉ.");
		}
	};

	const getClassAssign = async () => {
		try {
			const response = await CreditClassService.getAssignClass(props.data?.id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const users = response.data?.data;
				users?.forEach((user) => {
					user.name = `${user.first_name} ${user.last_name}`;
				});
				setDataSource(users);
			}
		} catch (err) {}
	};
	const handleSubmit = async (e) => {
		try {
			const listPrevent = ["id"];
			e.preventDefault();
			const errors = {};
			Object.keys(formData).forEach((item) => {
				if (!listPrevent.includes(item) && FeHelpers.isStringEmpty(formData[item])) {
					errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
				}
			});
			if (Object.keys(errors).length > 0) {
				setErrors(errors);
				return;
			}
			dataSource.forEach((item) => {
				if (formData.user_id === item.user_id) {
					toast.error("Giảng viên đã được phân công.");
					return;
				}
			});
			setLoading(true);
			if (formData.id.length === 0) formData.id = 0;
			const response = await CreditClassService.assignClass(formData);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Phân công thành công");
				await getClassAssign(props.data.id);
			}
		} catch (err) {
			toast.error("Phân công thất bại!");
			console.log("err: ", err);
		} finally {
			setLoading(false);
		}
	};
	async function handleDelete(data) {
		console.log(data);
		setUserRemove(data);
		setConfirmRemoveUserDialog(true);
	}
	async function handleConfirmDialog(data) {
		setConfirmRemoveUserDialog(false);
		try {
			if (data) {
				setLoading(true);
				const response = await CreditClassService.removeUserAssign(userRemove?.id);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Hủy phân công thành công");
					await getClassAssign(props.data.id);
				}
			}
		} catch (err) {
			toast.error("Hủy phân công thất bại");
			console.log(err);
		} finally {
			setLoading(false);
		}
	}
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
					className="disable-field"
					margin="normal"
					error={Boolean(errors.credit_class_id)}>
					{creditClasses.map((creditClass, index) => (
						<MenuItem key={index} value={creditClass.id}>
							{creditClass.subject_name}
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
					margin="normal"
					error={Boolean(errors.user_id)}>
					{users.length === 0 ? (
						<MenuItem key={"no-opt"} value="">
							Chưa có giảng viên nào
						</MenuItem>
					) : null}
					{users.map((user, index) => (
						<MenuItem key={index} value={user.id}>
							{user.firstName} {user.lastName} ({user.email})
						</MenuItem>
					))}
				</TextField>
				<Button type="submit" variant="contained" color="primary">
					Phân công
				</Button>
			</form>
			<h4 className="mt-3 mb-2">Danh sách đã phân công</h4>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}></CommonTableComponent>
			<CommonDialogComponent
				open={confirmRemoveUserDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleConfirmDialog}>
				<ConfirmDialog
					message="Bạn muốn hủy phân công giảng viên này?"
					handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Container>
	);
}
