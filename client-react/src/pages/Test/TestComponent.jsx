import "./TestComp.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, CardActions, Container } from "@mui/material";
import { TestService } from "./TestService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { useEffect, useRef, useState } from "react";
import { CONST, FILTER_DATA, RESPONSE_MESSAGE } from "../../utils/const";
import { toast } from "react-toastify";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { CommonDialogComponent } from "../../components/Common";
import CreateTest from "./CreateTestComponent";
import AssignTestComponent from "./AssignTestComponent";
import TestDetailComponent from "./TestDetailComponent";
import ConfirmDialog from "../../components/Common/CommonDialog/ConfirmDialog";
import { FeHelpers } from "../../utils/helpers";
import CommonFilterComponent from "../../components/Common/CommonFilter/CommonFilterComponent";
import { UserService } from "../User/UserService";
import { ResultService } from "../Result/ResultService";
import { useLoadingService } from "../../contexts/loadingContext";
import { SubjectService } from "../Subject/SubjectService";

export default function TestComponent() {
	const title = "Đề thi";

	const buttons = [
		{
			name: "Tạo đề thi",
			onClick: handleCreateTest,
		},
	];
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const [tests, setTests] = useState([]);
	const [test, setTest] = useState({});
	const [type, setType] = useState(CONST.DIALOG.TYPE.CREATE);
	const [openCreateTestDialog, setOpenCreateTestDialog] = useState(false);
	const [openAssignTestDialog, setOpenAssignTestDialog] = useState(false);
	const [openTestDetailDialog, setOpenTestDetailDialog] = useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [testDeleteId, setTestDeleteId] = useState(false);
	const permissions = FeHelpers.getUserPermission(currentUser);
	const HAS_ADMIN_PERMISSION = FeHelpers.isUserHasPermission(permissions, CONST.PERMISSION.ADMIN);
	const CURRENT_USER_ID = FeHelpers.getUserId(currentUser);
	const { loading, setLoading } = useLoadingService();
	CONST.ACCESS_TOKEN_EXPIRED;
	const filterRef = useRef({
		search: "",
		subject_id: "",
		year: "",
		semester: "",
	});
	const [commonFilter, setCommonFilter] = useState({
		search: {
			title: "Tìm kiếm...",
			handleChange: handleSearchChange,
		},
		dropdowns: {
			subjectFilter: {
				placeholder: "Môn học",
				value: "",
				key: FILTER_DATA.SUBJECT_ID,
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleFilterChange,
			},
			yearFilter: {
				placeholder: "Năm học",
				value: "",
				key: FILTER_DATA.YEAR,
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleFilterChange,
			},
			semesterFilter: {
				placeholder: "Học kỳ",
				value: "",
				key: FILTER_DATA.SEMESTER,
				options: [{ key: "Tất cả", value: "ALL" }],
				handleChange: handleFilterChange,
			},
		},
	});
	async function handleFilterChange(data, type) {
		switch (type) {
			case FILTER_DATA.SUBJECT_ID:
				filterRef.current = { ...filterRef.current, subject_id: data };
				break;
			case FILTER_DATA.SEMESTER:
				filterRef.current = { ...filterRef.current, semester: data };
				break;
			case FILTER_DATA.YEAR:
				filterRef.current = { ...filterRef.current, year: data };
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
			const response = await TestService.getAllTestFilter(filterRef.current, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setTests(response.data?.data);
				console.log(response.data?.data);
			} else {
				toast.error(RESPONSE_MESSAGE.TEST.GET_TEST_FAILED);
			}
		} catch (err) {
			toast.error(RESPONSE_MESSAGE.TEST.GET_TEST_FAILED);
			console.log("get all tests error: ", err);
		}
	}
	async function getSubjects(token) {
		try {
			const response = await SubjectService.getSubjectDropdownByUserId(token);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.subjectFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: item.name, value: item.id });
				});
				opts.subjectFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	async function getYears() {
		try {
			const response = await ResultService.getAllSemesterYear();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.yearFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: `${item.year}-${item.year + 1}`, value: item.year });
				});
				opts.yearFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	async function getSemesters() {
		try {
			const response = await ResultService.getAllSemesters();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				let opts = commonFilter.dropdowns;
				let sjOpts = opts?.semesterFilter?.options;
				sjOpts = sjOpts.length >= 1 ? sjOpts.slice(0, 1) : sjOpts;
				response.data?.data?.forEach((item) => {
					sjOpts.push({ key: `Học kỳ ${item.semester}`, value: item.semester });
				});
				opts.semesterFilter.options = sjOpts;
				setCommonFilter({ ...commonFilter, dropdowns: opts });
			}
		} catch (err) {
			console.log("err", err);
		}
	}
	//
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await getTests();
			await getSubjects(accessToken);
			await getYears();
			await getSemesters();
			setLoading(false);
		};
		fetchData();
	}, []);
	async function getTests() {
		try {
			const response = await TestService.getAllTest(accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setTests(response.data?.data);
				console.log(response.data?.data);
			} else {
				toast.error(RESPONSE_MESSAGE.TEST.GET_TEST_FAILED);
			}
		} catch (err) {
			toast.error(RESPONSE_MESSAGE.TEST.GET_TEST_FAILED);
			console.log("get all tests error: ", err);
		}
	}

	function handleCreateTest() {
		setOpenCreateTestDialog(true);
	}
	async function handleCloseDialog() {
		if (openCreateTestDialog) {
			setOpenCreateTestDialog(false);
		} else if (openAssignTestDialog) {
			setOpenAssignTestDialog(false);
		} else if (openTestDetailDialog) {
			setOpenTestDetailDialog(false);
		}
		await getTests();
	}
	function getDialogTitle() {
		switch (type) {
			case CONST.DIALOG.TYPE.CREATE:
				return "Tạo mới đề thi";
			case CONST.DIALOG.TYPE.VIEW:
				return "Chi tiết đề thi";
			case CONST.DIALOG.TYPE.EDIT:
				return "Chỉnh sửa đề thi";
			default:
				break;
		}
		return title;
	}
	function onClose() {
		if (openCreateTestDialog) {
			setOpenCreateTestDialog(false);
		} else if (openAssignTestDialog) {
			setOpenAssignTestDialog(false);
		} else if (openTestDetailDialog) {
			setOpenTestDetailDialog(false);
		}
	}
	function handleAssignTest(data) {
		if (data) setTest(data);
		setOpenAssignTestDialog(true);
	}
	function showDetail(data) {
		if (data) setTest(data);
		setOpenTestDetailDialog(true);
	}
	async function handleSubmitDeleteTest(data) {
		if (data) {
			const response = await TestService.deleteTest(testDeleteId, accessToken);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				toast.success("Xóa đề thi thành công!");
			} else {
				toast.error("Đề thi đã được phân công, không thể xóa!");
			}
			await getTests();
		}
		setOpenConfirmDialog(false);
	}
	const handleDeleteTest = (id) => {
		setTestDeleteId(id);
		setOpenConfirmDialog(true);
	};
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
				<CommonFilterComponent search={commonFilter.search} dropdowns={commonFilter.dropdowns}></CommonFilterComponent>
			</div>
			<div className="test-container my-3">
				{tests.map((test, index) => (
					<Card className="custom-card" label="Delete">
						{HAS_ADMIN_PERMISSION || CURRENT_USER_ID === test.user_id ? (
							<i className="fa-solid fa-trash delete_test" onClick={() => handleDeleteTest(test.id)}></i>
						) : null}
						<CardMedia component="img" height="100" className="bg-radient" />
						<CardContent className="pb-3 test-card-content">
							<Typography gutterBottom variant="h5" component="div" className="card-two-row">
								{test.name}
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Môn học:
								<Typography variant="h6" color="MenuText" className="card-two-row">
									{test.subject_name}
								</Typography>
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Năm học: <span style={{ fontWeight: "bold" }}>{test.semester_year}</span>
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Học kỳ: <span style={{ fontWeight: "bold" }}>{test.semester_semester}</span>
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Thời gian làm bài: <span style={{ fontWeight: "bold" }}>{test.time} phút</span>
							</Typography>
							<CardActions className="card-action p-0 mt-3">
								{HAS_ADMIN_PERMISSION || CURRENT_USER_ID === test.user_id ? (
									<Button
										size="small"
										color="primary"
										className="btn-opt"
										variant="outlined"
										onClick={(e) => handleAssignTest(test)}>
										Phân cho lớp tín chỉ
									</Button>
								) : null}
								<Button
									size="small"
									color="info"
									className="btn-opt"
									variant="contained"
									onClick={(e) => showDetail(test)}>
									Xem chi tiết
								</Button>
							</CardActions>
						</CardContent>
					</Card>
				))}
			</div>
			<CommonDialogComponent
				open={openCreateTestDialog}
				title={getDialogTitle()}
				icon="fa-solid fa-circle-plus"
				width="60vw"
				height="auto"
				onClose={onClose}>
				<CreateTest onSubmit={handleCloseDialog} data={test} type={type}></CreateTest>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openAssignTestDialog}
				title={"Phân công đề thi"}
				icon="fa-solid fa-pen-to-square"
				width="60vw"
				height="auto"
				onClose={onClose}>
				<AssignTestComponent onSubmit={handleCloseDialog} data={test}></AssignTestComponent>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openTestDetailDialog}
				title={"Chi tiết đề thi"}
				icon="fa-solid fa-circle-info"
				width="60vw"
				height="auto"
				onClose={onClose}>
				<TestDetailComponent onSubmit={handleCloseDialog} data={test}></TestDetailComponent>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openConfirmDialog}
				title={"Xác nhận xóa đề thi"}
				icon="fa-solid fa-triangle-exclamation"
				width="30vw"
				height="auto"
				onClose={onClose}>
				<ConfirmDialog
					handleClose={handleSubmitDeleteTest}
					message="Bạn chắc chắn muốn xóa đề thi này?"></ConfirmDialog>
			</CommonDialogComponent>
		</Box>
	);
}
