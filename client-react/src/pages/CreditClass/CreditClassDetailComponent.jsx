import { Autocomplete, Container } from "@mui/material";
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
import ImportDialogComponent from "../Question/ImportComponent";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { useSelector } from "react-redux";

const initialValues = {
	id: "",
	user_id: "",
	users: "",
	credit_class_id: "",
};

const QUANTITY = {
	MIN: 1,
	MAX: 1000,
};

export default function CreditClassDetailComponent(props) {
	const [errors, setErrors] = useState({});
	const { loading, setLoading } = useLoadingService();
	const [users, setUsers] = useState([]);
	const [creditClasses, setCreditClasses] = useState([]);
	const [dataSource, setDataSource] = useState([]);
	const [userRemove, setUserRemove] = useState({});
	const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
	const [openImportDialog, setOpenImportDialog] = useState(false);
	const accessToken = useSelector(selectAccessToken);
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	async function getInitData() {
		setLoading(true);
		await getClassAssign();
		await getCreditClasses();
		await getUsers();
		initFormData();
		setLoading(false);
	}
	const columnDef = [
		{
			colName: "Tên sinh viên",
			colDef: "name",
		},
		{
			colName: "Mã sinh viên",
			colDef: "user_code",
		},
		{
			colName: "Email",
			colDef: "user_email",
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
		const response = await UserService.getAllSV();
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			console.log("sinh vien all", response.data?.data);
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
			const response = await CreditClassService.getCreditClassDetail(props.data?.id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const users = response.data?.data;
				users?.forEach((user) => {
					user.name = `${user.first_name} ${user.last_name}`;
				});
				console.log(response.data?.data);
				setDataSource(users);
			}
		} catch (err) {}
	};
	const handleSubmit = async (e) => {
		try {
			const listPrevent = ["id", "user_id"];
			e.preventDefault();
			const errors = {};
			Object.keys(formData).forEach((item) => {
				if (!listPrevent.includes(item) && FeHelpers.isStringEmpty(formData[item])) {
					errors[item] = `Vui lòng nhập dữ liệu cho ${item}.`;
					console.log(`Vui lòng nhập dữ liệu cho ${item}.`);
				}
			});
			if (Object.keys(errors).length > 0) {
				setErrors(errors);
				return;
			}
			for (let item of dataSource) {
				if (formData.users.includes(item.user_id)) {
					toast.error("Sinh viên đã được phân công.");
					return;
				}
			}
			setLoading(true);
			formData.users = formData.users.split(",");
			const response = await CreditClassService.createListUserClassDetail(formData);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Thêm sinh viên thành công");
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
	const handleAutocompleteChange = (event, newValue) => {
		setFormData({ ...formData, users: newValue.map((item) => item.id).join(",") });
	};
	async function handleConfirmDialog(data) {
		setConfirmRemoveUserDialog(false);
		try {
			if (data) {
				setLoading(true);
				const response = await CreditClassService.removeUserClass(userRemove?.id);
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
	const handleCloseDialog = () => {
		setOpenImportDialog(false);
	};
	/**
	 * IMPORT
	 * @param {*} file
	 */
	function handleOpenImportQuestionDialog() {
		setOpenImportDialog(true);
	}
	async function handleExportQuestion() {
		setLoading(true);
		try {
			const response = await QuestionService.exportQuestion(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const pdfBuffer = atob(response.data?.data);
				const byteNumbers = new Array(pdfBuffer.length);
				for (let i = 0; i < pdfBuffer.length; i++) {
					byteNumbers[i] = pdfBuffer.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);
				const blob = new Blob([byteArray], { type: "application/pdf" });

				// Create a download link
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = `question_import_result_${new Date().getTime()}.xlsx`;
				document.body.appendChild(link);

				// Trigger the download
				link.click();

				// Clean up
				document.body.removeChild(link);
				toast.success("Export câu hỏi thành công");
			}
			setLoading(false);
		} catch (err) {
			toast.error("Export câu hỏi thất bại");
			setLoading(false);
		}
	}
	async function handleDownLoadTemplate() {
		//create object to save
		const link = document.createElement("a");
		link.href = CONST.SELF_URL + "/public/file/user_import_template.xlsx";
		link.setAttribute("download", `user_template_import_${new Date().getTime()}.xlsx`);

		document.body.appendChild(link);
		link.click();

		//clean up
		document.body.removeChild(link);
	}
	async function handleImportDialog(file) {
		const response = await CreditClassService.importUserClass({ file: file }, props.data.id, accessToken);
		if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
			const pdfBuffer = atob(response.data?.data);
			const byteNumbers = new Array(pdfBuffer.length);
			for (let i = 0; i < pdfBuffer.length; i++) {
				byteNumbers[i] = pdfBuffer.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: "application/pdf" });

			// Create a download link
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `question_import_result_${new Date().getTime()}.xlsx`;
			document.body.appendChild(link);

			// Trigger the download
			link.click();

			// Clean up
			document.body.removeChild(link);
			toast.success(`Import sinh viên vào lớp tín chỉ thành công`);
			setOpenImportDialog(false);
			await getClassAssign(props.data.id);
		}
	}
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			{HAS_ADMIN_PERMISSION ? (
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
					<Autocomplete
						multiple
						id="tags-outlined"
						options={users.filter((item) => !dataSource.map((i) => i.user_id).includes(item.id))}
						filterSelectedOptions
						getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
						onChange={handleAutocompleteChange}
						style={{ marginTop: 16, marginBottom: 8 }}
						renderInput={(params) => (
							<TextField {...params} label="Sinh viên" placeholder="Có thể chọn nhiều sinh viên..." />
						)}
					/>
					<div>
						<Button type="submit" className="me-2" variant="contained" color="primary">
							<i className="fa-solid fa-plus me-2"></i>Thêm sinh viên
						</Button>
					</div>
				</form>
			) : null}
			<h4 className="mt-3 mb-2">Danh sách lớp</h4>
			{HAS_ADMIN_PERMISSION ? (
				<div>
					<Button className="me-2" variant="contained" color="success" onClick={handleOpenImportQuestionDialog}>
						<i className="fa-solid fa-file-import me-2"></i>import sinh viên
					</Button>
					<Button className="me-2" variant="contained" color="warning" onClick={handleDownLoadTemplate}>
						<i className="fa-solid fa-download me-2"></i>template
					</Button>
				</div>
			) : null}
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={HAS_ADMIN_PERMISSION ? handleDelete : null}></CommonTableComponent>
			<CommonDialogComponent
				open={confirmRemoveUserDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleConfirmDialog}>
				<ConfirmDialog
					message="Bạn muốn hủy phân công sinh viên này?"
					handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openImportDialog}
				title="Import sinh viên"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleCloseDialog}>
				<ImportDialogComponent
					handleClose={handleCloseDialog}
					handleSubmit={handleImportDialog}></ImportDialogComponent>
			</CommonDialogComponent>
		</Container>
	);
}
