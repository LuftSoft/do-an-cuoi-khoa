import { Link, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import { axiosJWT, url } from "../../utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { dateToString } from "../../utils/helpers";
import UserInfo from "../../components/UserInfo/UserInfo";

export default function BookingRoomPage() {
	console.log("render");
	const { hotelId } = useParams();
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const bookingListState = useQuery({
		queryKey: ["bookingList", currentUser, hotelId],
		queryFn: async () => {
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.get(url.bookingList + hotelId, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				return res;
			} catch (error) {
				console.log(error);
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
	let bookingList = [];
	if (bookingListState.isSuccess && bookingListState.data.data.success) {
		bookingList = bookingListState.data.data.bookingList;
	}
	return (
		<>
			<div className="bg-light rounded h-100 p-4">
				<div className="mb-4 d-flex justify-content-between align-items-center">
					<h4 className="mb-0">Danh sách đơn đặt phòng</h4>
				</div>
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Tên phòng</th>
								<th scope="col">Khách sạn</th>
								<th scope="col">Ngày nhận</th>
								<th scope="col">Ngày trả</th>
								<th scope="col">Trạng thái</th>
								<th scope="col">Khách hàng</th>
								{/* <th scope="col">Chi tiết</th>
							<th scope="col">Duyệt</th>
							<th scope="col">Xóa/Hủy</th> */}
							</tr>
						</thead>
						<tbody>
							{bookingList.length > 0
								? bookingList.map((booking, index) => (
										<tr key={booking.id} className="align-middle">
											<th scope="row">{index + 1}</th>
											<td>{booking.roomName}</td>
											<td>{booking.hotelName}</td>
											<td>{dateToString(booking.fromDate)}</td>
											<td>{dateToString(booking.toDate)}</td>
											<td className={`${booking.returned ? " text-danger " : " text-success "}`}>
												{booking.returned ? "Đã hủy" : "Chưa hủy"}
											</td>
											<td>
												<>
													{/* Button trigger modal */}
													<button
														type="button"
														className="btn btn-primary"
														data-bs-toggle="modal"
														data-bs-target={`#user${booking.userId}`}>
														Xem
													</button>
													{/* Modal */}
													<UserInfo userId={booking.userId} />
												</>
											</td>
											{/* <td>
											<button type="button" className="btn btn-outline-primary">
												Xem
											</button>
										</td>
										<td>
											<button type="button" className="btn btn-outline-primary">
												Duyệt
											</button>
										</td>
										<td>
											<button className="btn btn-danger">Xóa</button>
										</td> */}
										</tr>
								  ))
								: null}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
