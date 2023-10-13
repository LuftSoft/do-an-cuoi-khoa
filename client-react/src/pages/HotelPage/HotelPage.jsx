import { Link } from "react-router-dom";
import { routes } from "../../routes";
import { useQuery } from "@tanstack/react-query";
import { axiosJWT, url } from "../../utils/httpRequest";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import { toast } from "react-toastify";
import { getCategories } from "../../services/categoryServices";
import "./HotelPage.css";

export default function HotelPage() {
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const listHotelState = useQuery({
		queryKey: ["hotel", currentUser.id],
		queryFn: async () => {
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.get(url.hotel, {
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
		// staleTime: 3 * 60 * 1000,
	});
	let listHotel = [];
	if (listHotelState.isSuccess && listHotelState.data.data.success) {
		listHotel = listHotelState.data.data.hotels;
	}
	const categoriesState = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	});
	let categories = [];
	if (categoriesState.isSuccess) {
		categories = categoriesState.data.category;
	}
	const handleDelete = async (id) => {
		if (confirm("Bạn có muốn xóa không?") == true) {
			const toastId = toast.loading("Đang xử lý!");
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.delete(url.deleteHotel + id, {
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				});
				res;
				listHotelState.refetch();
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
					render: "Không thể xóa! Khách sạn này đã có phòng! Xóa phòng trước!",
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
				<h5 className="mb-0 test-class">Danh sách khách sạn</h5>
				<Link to={routes.createHotel} className="btn btn-outline-primary">
					Thêm khách sạn
				</Link>
			</div>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Tên khách sạn</th>
							<th scope="col">Số sao</th>
							<th scope="col">Loại</th>
							<th scope="col">Trạng thái</th>
							<th scope="col">Chi tiết</th>
							<th scope="col">Phòng</th>
							<th scope="col">Đơn đặt phòng</th>
							<th scope="col">Xóa/Hủy</th>
						</tr>
					</thead>
					<tbody>
						{listHotel.length > 0
							? listHotel.map((hotel, index) => (
									<tr key={hotel.id} className="align-middle">
										<th scope="row">{index + 1}</th>
										<td>{hotel.name}</td>
										<td>{hotel.star}</td>
										<td>
											{
												categories.find((category) => {
													return category.id === hotel.hotelCategoryId;
												})?.name
											}
										</td>
										<td className={`${hotel.approval ? "" : " text-danger "}`}>
											{hotel.approval ? "Đã được duyệt" : "Chưa được duyệt"}
										</td>
										<td>
											<Link
												to={routes.hotel + "/" + hotel.id}
												className={`btn ${true ? "btn-outline-primary " : " btn-secondary disabled"}`}>
												Xem
											</Link>
										</td>
										<td>
											<Link
												to={routes.hotel + "/" + hotel.id + "/room"}
												className={`btn ${hotel.approval ? "btn-outline-primary " : " btn-secondary disabled"}`}>
												Xem
											</Link>
										</td>
										<td>
											<Link
												to={routes.hotel + "/" + hotel.id + "/booking"}
												className={`btn ${hotel.approval ? "btn-outline-primary " : " btn-secondary disabled"}`}>
												Xem
											</Link>
										</td>
										<td>
											<button
												type="button"
												onClick={() => {
													handleDelete(hotel.id);
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
