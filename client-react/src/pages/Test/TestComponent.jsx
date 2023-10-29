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
	useEffect(() => {
		const fetchData = async () => {
			await getTests();
			console.log(tests);
		};
		fetchData();
	}, []);
	console.log(tests);
	function getTests() {
		return TestService.getAllTest()
			.then((response) => {
				if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
					setTests(response.data?.data);
				} else {
				}
			})
			.catch((err) => {
				toast.error("get all tests failed");
				console.log("get all tests error: ", err);
			});
	}

	function handleCreateTest() {
		setOpenCreateTestDialog(true);
	}
	async function handleCloseDialog() {
		setOpenCreateTestDialog(false);
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
		setOpenCreateTestDialog(false);
	}
	function showResult(param) {}
	function showDetail(param) {}
	return (
		<Box>
			<div>
				<TitleButtonComponent title={title} buttons={buttons} />
			</div>
			<div className="test-container my-3">
				{tests.map((test, index) => (
					<Card sx={{ maxWidth: 345, maxHeight: 400 }} className="custom-card" label="Delete">
						<i className="fa-solid fa-trash delete_test"></i>
						<CardMedia component="img" height="100" className="bg-radient" />
						<CardContent className="pb-3">
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
								Thời gian bắt đầu:
								<div>{test.start_time}</div>
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Thời gian làm bài: {test.schedule_time} phut
							</Typography>
							<CardActions className="card-action p-0 mt-3">
								<Button size="small" color="info" className="btn-opt" variant="outlined" onClick={showDetail}>
									Xem chi tiết
								</Button>
								<Button size="small" color="primary" className="btn-opt" variant="outlined" onClick={showResult}>
									Thống kê kết quả
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
		</Box>
	);
}
