import { Link, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";

export default function RoomPage() {
	const { hotelId } = useParams();
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const hotelState = useQuery({
		queryKey: ["hotel", hotelId],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.room + hotelId);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
	let rooms = [];
	if (hotelState.isSuccess) {
		rooms = hotelState.data.hotelDto.rooms;
	}
	const handleDelete = async (id) => {
		if (confirm("Bạn có muốn xóa không?") == true) {
			const toastId = toast.loading("Đang xử lý!");
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.delete(url.deleteRoom + id, {
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				});
				hotelState.refetch();
				toast.update(toastId, {
					render: "Xóa thành công!",
					type: "success",
					closeButton: true,
					autoClose: 1000,
					isLoading: false,
				});
			} catch (error) {
				console.log(error);
				toast.update(toastId, {
					render: "Không thể xóa! Phòng đã được đặt!",
					type: "error",
					closeButton: true,
					autoClose: 1000,
					isLoading: false,
				});
			}
		}
	};
	return (
		<div className="bg-light rounded h-100 p-4">
			<div className="mb-4 d-flex justify-content-between align-items-center">
				<h4 className="mb-0">Danh sách phòng</h4>
				<Link to={routes.hotel + "/" + hotelId + "/room/create"} className="btn btn-outline-primary">
					Thêm phòng
				</Link>
			</div>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Tên Phòng</th>
							<th scope="col">Loại Phòng</th>
							<th scope="col">Giá (VNĐ)</th>
							<th scope="col">Tổng Phòng</th>
							<th scope="col">Chi tiết</th>
							<th scope="col">Xóa/Hủy</th>
						</tr>
					</thead>
					<tbody>
						{rooms.length > 0
							? rooms.map((room, index) => (
									<tr key={room.id} className="align-middle">
										<th scope="row">{index + 1}</th>
										<td>{room.name}</td>
										<td>{room.typeOfBed}</td>
										<td>{new Intl.NumberFormat().format(room.price)}</td>
										<td>{room.totalRoom}</td>
										<td>
											<Link to={routes.hotel + "/" + hotelId + "/room/" + room.id} className="btn btn-outline-primary">
												Xem
											</Link>
										</td>
										<td>
											<button
												type="button"
												onClick={() => {
													handleDelete(room.id);
												}}
												className="btn btn-danger">
												Xóa
											</button>
										</td>
									</tr>
							  ))
							: null}
					</tbody>
				</table>
			</div>
		</div>
	);
}
