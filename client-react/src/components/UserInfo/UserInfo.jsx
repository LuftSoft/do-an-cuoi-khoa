import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosJWT, url } from "../../utils/httpRequest";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken } from "../../redux/selectors";

export default function UserInfo({ userId }) {
	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	// ---------------------------------------------------------------------------
	const userState = useQuery({
		queryKey: ["user-info", userId],
		queryFn: async () => {
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.get(url.getBookedUserInfo + userId, {
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				});
				return res;
			} catch (error) {
				console.log(error);
				return Promise.reject(error);
			}
		},
	});
	let user = {};
	if (userState.isSuccess) {
		user = userState.data.data;
	}
	return (
		<div
			className="modal fade"
			id={`user${userId}`}
			tabIndex={-1}
			aria-labelledby={`user${userId}Label`}
			aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5 text-capitalize" id={`user${userId}Label`}>
							{"Thông tin khách hàng " + user.lastName + " " + user.firstName}
						</h1>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div className="modal-body">
						<div className="bg-white">
							<div className="d-flex flex-column px-5">
								<div className="d-flex flex-column">
									<div className="mb-3 row">
										<aside className="col-sm-3 d-flex">
											<div className="border border-2 rounded-circle p-1 overflow-hidden">
												{
													<img
														className="rounded-circle"
														src={user.avatar ? user.avatar : "/img/user-avatar.png"}
														alt=""
														style={{ width: 60, height: 60, objectFit: "cover" }}
														onError={(e) => {
															e.target.src = "/img/user-avatar.png";
														}}
													/>
												}
											</div>
										</aside>
										<div className="col-sm-9 d-flex flex-column justify-content-center">
											<span className="fw-bold">{user.lastName + " " + user.firstName}</span>
										</div>
									</div>
									<div className="mb-3 row">
										<label htmlFor="" className="col-sm-3 col-form-label">
											Họ
										</label>
										<div className="col-sm-9">
											<input type="text" readOnly defaultValue={user.lastName} className={`form-control`} />
										</div>
									</div>
									<div className="mb-3 row">
										<label htmlFor="" className="col-sm-3 col-form-label">
											Tên
										</label>
										<div className="col-sm-9">
											<input type="text" readOnly defaultValue={user.firstName} className={`form-control`} />
										</div>
									</div>
									<div className="mb-3 row">
										<label htmlFor="" className="col-sm-3 col-form-label">
											Tuổi
										</label>
										<div className="col-sm-9">
											<input type="number" readOnly defaultValue={user.age} min={14} className={`form-control`} />
										</div>
									</div>
									<div className="mb-3 row">
										<label htmlFor="" className="col-sm-3 col-form-label">
											Email
										</label>
										<div className="col-sm-9">
											<input type="email" readOnly defaultValue={user.email} className={`form-control`} />
										</div>
									</div>
									<div className="row">
										<label htmlFor="" className="col-sm-3 col-form-label">
											Số điện thoại
										</label>
										<div className="col-sm-9">
											<input type="text" readOnly defaultValue={user.phoneNumber} className={`form-control`} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
							Đóng
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
