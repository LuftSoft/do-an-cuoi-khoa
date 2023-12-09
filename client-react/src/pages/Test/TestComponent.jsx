import "./TestComp.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, CardActions, Container } from "@mui/material";
import { TestService } from "./TestService";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../redux/selectors";
import { useEffect, useState } from "react";
import { CONST } from "../../utils/const";
import { toast } from "react-toastify";
import TitleButtonComponent from "../../components/Common/CommonHeader/CommonHeaderComponent";
import { CommonDialogComponent } from "../../components/Common";
import CreateTest from "./CreateTestComponent";
import AssignTestComponent from "./AssignTestComponent";
import TestDetailComponent from "./TestDetailComponent";

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
	const permissions = currentUser.permissions[0] || [];
	const HAS_ADMIN_PERMISSION = permissions.some((p) => p.name === CONST.PERMISSION.ADMIN);
	useEffect(() => {
		const fetchData = async () => {
			await getTests();
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
				toast.error("Tải danh sách đề thi thất bại");
			}
		} catch (err) {
			toast.error("Tải danh sách đề thi thất bại");
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
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<div className="test-container my-3">
				{tests.map((test, index) => (
					<Card className="custom-card" label="Delete">
						{HAS_ADMIN_PERMISSION ? <i className="fa-solid fa-trash delete_test"></i> : null}
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
								{HAS_ADMIN_PERMISSION ? (
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
				icon="fa-solid fa-circle-plus"
				width="60vw"
				height="auto"
				onClose={onClose}>
				<AssignTestComponent onSubmit={handleCloseDialog} data={test}></AssignTestComponent>
			</CommonDialogComponent>
			<CommonDialogComponent
				open={openTestDetailDialog}
				title={"Chi tiết đề thi"}
				icon="fa-solid fa-circle-plus"
				width="60vw"
				height="auto"
				onClose={onClose}>
				<TestDetailComponent onSubmit={handleCloseDialog} data={test}></TestDetailComponent>
			</CommonDialogComponent>
		</Box>
	);
}
