import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import { useLoadingService } from "../../contexts/loadingContext";

import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";

import { toast } from "react-toastify";
import { CreateUserComponent } from ".";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { selectAccessToken } from "../../redux/selectors";
import { CONST } from "../../utils/const";
import { UserService } from "./UserService";
import { FeHelpers } from "../../utils/helpers";
import { QuestionService } from "../Question/QuestionService";
import ImportDialogComponent from "../Question/ImportComponent";
import CommonFilterComponent from "../../components/Common/CommonFilter/CommonFilterComponent";
export default function UserComponent() {
	const title = "Danh sách tài khoản";
	const buttons = [
		{
			name: "Thêm tài khoản",
			icon: "fa-solid fa-plus",
			onClick: handleButtonClick,
		},
		{
			name: "Import",
			icon: "fa-solid fa-file-import",
			color: CONST.BUTTON.COLOR.SUCCESS,
			onClick: handleOpenImportQuestionDialog,
		},
		// {
		// 	name: "Export",
		// 	icon: "fa-solid fa-file-export",
		// 	color: CONST.BUTTON.COLOR.SUCCESS,
		// 	onClick: handleExportQuestion,
		// },
		{
			name: "Template",
			icon: "fa-solid fa-download",
			onClick: handleDownLoadTemplate,
			color: CONST.BUTTON.COLOR.WARNING,
		},
	];
	const loadingService = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	//set type of dialog open;
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [openImportDialog, setOpenImportDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [userDialogData, setUserDialogData] = useState({
		type: CONST.DIALOG.TYPE.ADD,
		id: null,
	});
	const filterRef = useRef({
		search: "",
		gender: "",
		type: "",
	});
	const TYPE = "TYPE";
	const GENDER = "GENDER";
	const accessToken = useSelector(selectAccessToken);
	const [commonFilter, setCommonFilter] = useState({
		search: {
			title: "Tìm kiếm...",
			handleChange: handleSearchChange,
		},
		dropdowns: {
			genderFilter: {
				placeholder: "Giới tính",
				value: "",
				key: GENDER,
				options: [
					{ key: "Tất cả", value: "ALL" },
					{ key: "Nam", value: "male" },
					{ key: "Nữ", value: "female" },
				],
				handleChange: handleFilterChange,
			},
			typeFilter: {
				placeholder: "Loại",
				value: "",
				key: TYPE,
				options: [
					{ key: "Tất cả", value: "ALL" },
					{ key: "Sinh viên", value: "SV" },
					{ key: "Giảng viên", value: "GV" },
				],
				handleChange: handleFilterChange,
			},
		},
	});
	//filter
	async function handleFilterChange(data, type) {
		switch (type) {
			case TYPE:
				filterRef.current = { ...filterRef.current, type: data };
				break;
			case GENDER:
				filterRef.current = { ...filterRef.current, gender: data };
				break;
			default:
				break;
		}
		await handleFilter();
	}
	//search
	async function handleSearchChange(data) {
		filterRef.current = { ...filterRef.current, search: data };
		await handleFilter();
	}
	//submit data
	async function handleFilter() {
		try {
			const response = await UserService.getAllUserFilter(filterRef.current);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				response.data?.data.forEach((user) => {
					user.full_name = `${user?.firstName} ${user?.lastName}`;
					user.dateOfBirth = FeHelpers.convertDate(user?.dateOfBirth);
					user.gender_translate = FeHelpers.translateGender(user?.gender);
					user.type_translate = FeHelpers.translateUserType(user?.type);
					user.className = {};
					switch (user?.type) {
						case CONST.USER.TYPE.SV:
							user.className.type_translate = "bg-easy";
							break;
						case CONST.USER.TYPE.GV:
							user.className.type_translate = "bg-medium";
							break;
						default:
							break;
					}
					user.avatar = `<img class="avatar-small" src="data:image/png;base64,${user.avatar}" alt="avatar" />`;
				});
				setDataSource(response.data?.data);
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			console.log(err);
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	async function getUsers() {
		try {
			const response = await UserService.getAllUser();
			console.log("response bang: ", response);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				response.data?.data.forEach((user) => {
					user.full_name = `${user?.firstName} ${user?.lastName}`;
					user.dateOfBirth = FeHelpers.convertDate(user?.dateOfBirth);
					user.gender_translate = FeHelpers.translateGender(user?.gender);
					user.type_translate = FeHelpers.translateUserType(user?.type);
					user.className = {};
					switch (user?.type) {
						case CONST.USER.TYPE.SV:
							user.className.type_translate = "bg-easy";
							break;
						case CONST.USER.TYPE.GV:
							user.className.type_translate = "bg-medium";
							break;
						default:
							break;
					}
					user.avatar = `<img class="avatar-small" src="data:image/png;base64,${user.avatar}" alt="avatar" />`;
				});
				setDataSource(response.data?.data);
			} else {
				toast.error("Tải danh sách tài khoản thất bại");
			}
		} catch (err) {
			console.log(err);
			toast.error("Tải danh sách tài khoản thất bại");
		}
	}
	//init data
	useEffect(() => {
		const fetchData = async () => {
			loadingService.setLoading(true);
			await getUsers();
			loadingService.setLoading(false);
		};
		fetchData();
	}, []);
	async function handleClose(data) {
		if (data?.code === CONST.API_RESPONSE.SUCCESS) {
			await getUsers();
			setOpenCreateUserDialog(false);
		} else {
			setOpenCreateUserDialog(true);
		}
	}
	function onClose() {
		setConfirmDialog(false);
		setOpenImportDialog(false);
		setOpenCreateUserDialog(false);
	}
	const columnDef = [
		{
			colName: "Mã người dùng",
			colDef: "code",
		},
		{
			colName: "Họ và tên",
			colDef: "full_name",
		},
		{
			colName: "Email",
			colDef: "email",
		},
		{
			colName: "Loại",
			colDef: "type_translate",
		},
		{
			colName: "Hình ảnh",
			colDef: "avatar",
		},
		{
			colName: "Giới tính",
			colDef: "gender_translate",
		},
	];

	function handleButtonClick() {
		setUserDialogData({
			type: CONST.DIALOG.TYPE.ADD,
			id: null,
		});
		setOpenCreateUserDialog(true);
	}
	function handleEdit(row) {
		setUserDialogData({
			type: CONST.DIALOG.TYPE.EDIT,
			id: row.id,
		});
		setOpenCreateUserDialog(true);
	}
	function handleDelete(row) {
		setDeleteId(row.id);
		setConfirmDialog(true);
	}
	async function handleConfirmDialog(value) {
		setConfirmDialog(false);
		if (value) {
			await deleteUser(deleteId);
			setTimeout(async () => {
				await getUsers();
			}, 200);
		}
	}
	async function deleteUser(id) {
		try {
			const response = await UserService.deleteUser(id, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Xóa tài khoản thành công");
			} else {
				toast.error("Xóa tài khoản thất bại");
			}
		} catch (err) {
			toast.error(err.message);
		}
	}
	function getDialogTitle() {
		let title = "";
		switch (type) {
			case CONST.DIALOG.TYPE.CREATE:
				title = "Tạo tài khoản";
				break;
			case CONST.DIALOG.TYPE.VIEW:
				title = "Chi tiết tài khoản";
				break;
			case CONST.DIALOG.TYPE.EDIT:
				title = "Chỉnh sửa tài khoản";
				break;
		}
		return title;
	}
	/**
	 * IMPORT
	 * @param {*} file
	 */
	function handleOpenImportQuestionDialog() {
		setOpenImportDialog(true);
	}
	async function handleExportQuestion() {
		loadingService.setLoading(true);
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
			loadingService.setLoading(false);
		} catch (err) {
			toast.error("Export câu hỏi thất bại");
			loadingService.setLoading(false);
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
	const handleImportDialog = async (file) => {
		const response = await UserService.import({ file: file }, accessToken);
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
			toast.success(`Import tài khoản thành công`);
			setOpenImportDialog(false);
			await getUsers();
		}
	};
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
				<CommonFilterComponent search={commonFilter.search} dropdowns={commonFilter.dropdowns}></CommonFilterComponent>
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
				onDelete={handleDelete}
				onEdit={handleEdit}></CommonTableComponent>
			<CommonDialogComponent
				open={openCreateUserDialog}
				title={getDialogTitle()}
				icon="fa-solid fa-circle-plus"
				width="45vw"
				height="50vh"
				onClose={onClose}>
				<CreateUserComponent data={userDialogData} onSubmit={handleClose} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={confirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ConfirmDialog message="Bạn muốn xóa người dùng này?" handleClose={handleConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openImportDialog}
				title="Import người dùng"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={onClose}>
				<ImportDialogComponent handleClose={onClose} handleSubmit={handleImportDialog}></ImportDialogComponent>
			</CommonDialogComponent>
		</Box>
	);
}
