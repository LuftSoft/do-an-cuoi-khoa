import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
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
	const permissions = useSelector(selectUser).permissions[0] || [];
	const HAS_ADMIN_PERMISSION = permissions.some((p) => p.name === CONST.PERMISSION.ADMIN);
	function getChapters() {
		setLoading(true);
		SubjectService.getAllChapter()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					const data = response.data?.data ? response.data?.data : [];
					setDataSource(data);
				}
			})
			.catch((err) => console.log(err));
		setLoading(false);
	}
	function handleClose(data) {
		if (data.data.code === "SUCCESS") {
			setOpenCreateChapterDialog(false);
			getChapters();
		} else {
			setOpenCreateChapterDialog(true);
		}
	}
	function onCloseCreateSubjectForm() {
		setOpenCreateChapterDialog(false);
	}
	const columnDef = [
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

	var [dataSource, setDataSource] = useState([]);
	useEffect(() => {
		getChapters();
	}, []);
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
					getChapters();
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
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={HAS_ADMIN_PERMISSION ? buttons : []} />
			</div>
			<CommonTableComponent
				columnDef={columnDef}
				dataSource={dataSource}
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
