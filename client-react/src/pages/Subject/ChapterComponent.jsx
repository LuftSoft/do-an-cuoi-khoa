import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CreateChapterComponent } from ".";
import { CommonDialogComponent, CommonTableComponent } from "../../components/Common";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { useLoadingService } from "../../contexts/loadingContext";
import { CONST } from "../../utils/const";
import { SubjectService } from "./SubjectService";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import CommonFilterComponent from "../../components/Common/CommonFilter/CommonFilterComponent";
import { FeHelpers } from "../../utils/helpers";

export default function ChapterComponent() {
	const title = "Danh sách môn học";
	const createTitle = "Tạo chương";
	const buttons = [
		{
			name: "Tạo chương",
			onClick: handleButtonClick,
		},
	];
	const { loading, setLoading } = useLoadingService();
	const dispatch = useDispatch();
	const [openCreateChapterDialog, setOpenCreateChapterDialog] = useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [deleteChapterId, setDeleteChapterId] = useState(null);
	const [detailChapterDialogData, setDetailChapterDialogData] = useState({ type: "add", id: null });
	const accessToken = useSelector(selectAccessToken);
	const currentUser = useSelector(selectUser);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	const CURRENT_USER_ID = FeHelpers.getUserId(currentUser);
	const dataSourceRef = useRef([]);
	const [dataSourceFilter, setDataSourceFilter] = useState([]);
	const OPTION_ALL = "ALL";
	const [commonFilter, setCommonFilter] = useState({
		dropdowns: {
			subjectFilter: {
				placeholder: "Môn học",
				value: "",
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleSubjectFilterChange,
			},
		},
	});
	async function getChapters() {
		try {
			const response = await SubjectService.getAllChapter(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				const data = response.data?.data ? response.data?.data : [];
				dataSourceRef.current = data;
				setDataSourceFilter(data);
			} else {
				toast.error("Tải danh sách chương thất bại");
			}
		} catch (err) {
			console.log(err);
		}
	}
	async function handleClose(data) {
		if (data.data.code === "SUCCESS") {
			setOpenCreateChapterDialog(false);
			await getChapters();
		} else {
			setOpenCreateChapterDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateChapterDialog(false);
	}
	const columnDef = [
		{
			colName: "Mã chương",
			colDef: "id",
		},
		{
			colName: "Tên chương",
			colDef: "name",
		},
		{
			colName: "Môn học",
			colDef: "subject_name",
		},
		{
			colName: "Chương số",
			colDef: "index",
		},
	];
	//init
	useEffect(() => {
		const fetchData = async () => {
			await getSubjects();
			await getChapters();
		};
		fetchData();
	}, []);
	async function getSubjects() {
		try {
			const response = await SubjectService.getSubjectDropdownByUserId(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.subjectFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: item.name, value: item.id });
				});
				opts.subjectFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			} else {
				toast.error(response.data?.message);
			}
		} catch (err) {
			toast.error(err.message);
		}
	}
	function handleButtonClick() {
		setDetailChapterDialogData({
			type: "add",
			id: null,
		});
		setOpenCreateChapterDialog(true);
	}
	async function handleEdit(row) {
		setDetailChapterDialogData({
			type: "edit",
			id: row.id,
		});
		setOpenCreateChapterDialog(true);
	}
	async function handleDelete(row) {
		setOpenConfirmDialog(true);
		setDeleteChapterId(row.id);
	}
	async function handleCloseConfirmDialog(data) {
		if (data) {
			try {
				setLoading(true);
				const response = await SubjectService.deleteChapter(deleteChapterId, accessToken);
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					toast.success("Xóa chương thành công");
					await getChapters();
				} else {
					toast.error("Chương đã có môn học, không thể xóa");
				}
				setLoading(false);
			} catch (err) {
				toast.error("Có lỗi xảy ra khi xóa chương");
				setLoading(false);
			}
		}
		setOpenConfirmDialog(false);
	}
	async function handleSubjectFilterChange(id) {
		console.log(id);
		if (id === OPTION_ALL) {
			setDataSourceFilter(dataSourceRef.current);
			return;
		}
		setDataSourceFilter(dataSourceRef.current.filter((item) => item.subject_id === id));
	}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={HAS_ADMIN_PERMISSION ? buttons : []} />
				<CommonFilterComponent dropdowns={commonFilter.dropdowns}></CommonFilterComponent>
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSourceFilter}
				onEdit={HAS_ADMIN_PERMISSION ? handleEdit : null}
				onDelete={HAS_ADMIN_PERMISSION ? handleDelete : null}></CommonTableComponent>
			<CommonDialogComponent
				width="30vw"
				height="50vh"
				open={openCreateChapterDialog}
				icon={detailChapterDialogData.type === "add" ? "fa-solid fa-plus" : "fa-solid fa-pen-to-square"}
				title={detailChapterDialogData.type === "add" ? "Tạo chương" : "Chỉnh sửa chương"}
				onClose={onCloseCreateSubjectForm}>
				<CreateChapterComponent onSubmit={handleClose} data={detailChapterDialogData} />
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openConfirmDialog}
				title="Xác nhận"
				icon="fa-solid fa-circle-plus"
				width="30vw"
				height="50vh"
				onClose={handleCloseConfirmDialog}>
				<ConfirmDialog message="Bạn muốn xóa chương này?" handleClose={handleCloseConfirmDialog}></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
