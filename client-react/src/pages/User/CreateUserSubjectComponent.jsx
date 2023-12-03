import React, { useEffect, useState } from "react";
import { TextField, Button, Container, MenuItem } from "@mui/material";
import { useLoadingService } from "../../contexts/loadingContext";
import { toast } from "react-toastify";
import { CONST } from "../../utils/const";
import { SubjectService } from "../Subject/SubjectService";
import { UserService } from "./UserService";

export default function CreateUserSubjectComponent({ onSubmit, data }) {
	const [formData, setFormData] = useState({
		user_id: data?.user_id,
		user_cluster_id: "",
		subject_id: "",
	});
	const [error, setErrors] = useState({});
	const [subjects, setSubjects] = useState([]);
	const [userSubjects, setUserSubjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState(null);
	const loadingService = useLoadingService();
	const TYPE = {
		SUBJECT: "subject",
		ROLE: "role",
	};
	async function getAllSubject() {
		loadingService.setLoading(true);
		const subject = await SubjectService.getAllSubject();
		loadingService.setLoading(false);
		return subject;
	}
	useEffect(() => {
		const fetchData = async () => {
			await getInitData();
		};
		fetchData();
	}, []);
	const getInitData = async () => {
		await getUser(data.user_id);
		switch (data.type) {
			case TYPE.SUBJECT:
				await getUserSubjects(data.user_id);
				await getSubjects();
				break;
			case TYPE.ROLE:
				await getUsers();
				break;
			default:
				break;
		}
	};
	const getChapterDetail = async (id) => {
		try {
			const response = await SubjectService.getOneChapter(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setChapter(response.data?.data);
			} else {
				toast.error("Tải chi tiết chương thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải chi tiết chương");
		}
	};
	/**
	 *
	 * @param {*} id
	 */
	const getUsers = async () => {
		try {
			const response = await UserService.getUCSUser();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setUsers(response.data?.data?.filter((item) => item.user_id !== data.user_id));
			} else {
				toast.error("Tải user list thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải user list");
		}
	};
	/**
	 * get all subject and cluster of user in user_cluster_subjects
	 * @param {*} id
	 */
	const getUser = async (id) => {
		try {
			const response = await UserService.getUCSUserDetail(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setUser(response.data?.data);
			} else {
				toast.error("Thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		const errors = {};
		if (!formData.subject_id.trim()) {
			errors.subject_id = "Vui lòng chọn môn học";
		}
		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}
		loadingService.setLoading(true);
		try {
			switch (data.type) {
				case TYPE.ROLE:
					const roleResponse = await UserService.createUserClusterSubject(formData);
					if (roleResponse.data?.code === CONST.API_RESPONSE.SUCCESS) {
						toast.success("Thêm quyền truy cập bộ câu hỏi thành công!");
					} else {
						toast.error("Thêm quyền truy cập bộ câu hỏi thất bại");
					}
					onSubmit(roleResponse);
					break;
				case TYPE.SUBJECT:
					formData.user_cluster_id = undefined;
					const editResponse = await UserService.createUserClusterSubject(formData);
					if (editResponse.data?.code === CONST.API_RESPONSE.SUCCESS) {
						toast.success("Thêm môn học vào bộ quyền thành công");
					} else {
						toast.error("Thêm môn học vào bộ quyền thất bại");
					}
					onSubmit(editResponse);
					break;
				default:
					break;
			}

			loadingService.setLoading(false);
		} catch (err) {
			loadingService.setLoading(false);
		}
	};
	/**
	 * get all subject in table user_cluster_subject by user id
	 * @param {*} id
	 *
	 */
	const handleUserClusterChange = async (id) => {
		try {
			const response = await UserService.getUCSSubjectByUserId(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				console.log(user, response.data?.data);
				const userSubjectIds = user.filter((item) => item.user_id === id).map((item) => item.subject_id);
				setSubjects(response.data?.data.filter((item) => !userSubjectIds.includes(item.subject_id)));
			} else {
				toast.error("Thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải");
		}
	};

	const getUserSubjects = async (id) => {
		try {
			const response = await UserService.getUCSSubjectByUserId(id);
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setUserSubjects(response.data?.data);
			} else {
				toast.error("Thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải");
		}
	};

	const getSubjects = async (id) => {
		try {
			const response = await SubjectService.getAllSubject();
			if (response.data?.code === CONST.API_RESPONSE.SUCCESS) {
				setSubjects(response.data?.data);
			} else {
				toast.error("Thất bại");
			}
		} catch (err) {
			toast.error("Có lỗi xảy ra trong quá trình tải");
		}
	};
	const getSubjectTypeSUbject = () => {
		const userSjId = userSubjects.map((item) => item.subject_id);
		return subjects.filter((item) => !userSjId.includes(item.id));
	};
	return (
		<Container style={{ padding: "0 24px 24px 24px" }}>
			<form onSubmit={handleSubmit}>
				{data.type === TYPE.ROLE ? (
					<div>
						<TextField
							select
							label="Người dùng"
							variant="outlined"
							name="user"
							value={formData.user_cluster_id}
							onChange={(e) => {
								setFormData({ ...formData, user_cluster_id: e.target.value });
								handleUserClusterChange(e.target.value);
							}}
							fullWidth
							margin="normal">
							{users.length === 0 ? (
								<MenuItem value={""} key={"no_data"}>
									Không có dữ liệu
								</MenuItem>
							) : (
								users.map((user, index) => (
									<MenuItem value={user.user_id} key={index}>
										{user.user_name + " (" + user.email + ")"}
									</MenuItem>
								))
							)}
						</TextField>
						<TextField
							select
							label="Môn học"
							variant="outlined"
							name="subject"
							value={formData.subject_id}
							disabled={formData?.user_cluster_id?.length === 0 && data.type === TYPE.ROLE}
							error={Boolean(error.subject_id)}
							onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
							fullWidth
							margin="normal">
							{subjects.length === 0 ? (
								<MenuItem value={""} key={"no_data"}>
									Không có dữ liệu
								</MenuItem>
							) : (
								subjects.map((subject, index) => (
									<MenuItem value={subject.subject_id} key={index}>
										{subject.subject_name}
									</MenuItem>
								))
							)}
						</TextField>
					</div>
				) : (
					<TextField
						select
						label="Môn học"
						variant="outlined"
						name="subject"
						value={formData.subject_id}
						disabled={formData?.user_cluster_id?.length === 0 && data.type === TYPE.ROLE}
						error={Boolean(error.subject_id)}
						helperText={error.subject_id}
						onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
						fullWidth
						margin="normal">
						{getSubjectTypeSUbject().length === 0 ? (
							<MenuItem value={""} key={"no_data"}>
								Không có dữ liệu
							</MenuItem>
						) : (
							getSubjectTypeSUbject().map((subject, index) => (
								<MenuItem value={subject.id} key={index}>
									{subject.name}
								</MenuItem>
							))
						)}
					</TextField>
				)}
				<div className="d-flex justify-content-end">
					<Button className="mt-3" variant="contained" color="primary" type="submit">
						<i className="fa-solid fa-floppy-disk me-2"></i> Lưu
					</Button>
				</div>
			</form>
		</Container>
	);
}
