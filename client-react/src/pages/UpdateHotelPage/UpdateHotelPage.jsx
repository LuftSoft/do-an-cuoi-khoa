import { useQuery } from "@tanstack/react-query";
import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import HorizontalInput from "../../components/HorizontalInput";
import HorizontalSelect from "../../components/HorizontalSelect";
import Checkbox from "../../components/Checkbox";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import TextAreaMe from "../../components/TextAreaMe/TextAreaMe";
import { routes } from "../../routes";
import { getDetailHotel } from "../../services/hotelServices";
import { getCategories } from "../../services/categoryServices";

export default function UpdateHotelPage() {
	const nameRef = useRef();
	const descriptionRef = useRef();
	const addressRef = useRef();
	const avatarRef = useRef();
	const slugRef = useRef();
	const categoryRef = useRef();
	const provinceRef = useRef();
	const districtRef = useRef();
	const homeletRef = useRef();
	const restaurantRef = useRef();
	const _24hRef = useRef();
	const elevatorRef = useRef();
	const poolRef = useRef();
	const freeBreakfastRef = useRef();
	const airConditionerRef = useRef();
	const lendingCarRef = useRef();
	const wifiFreeRef = useRef();
	const parkingRef = useRef();
	const allowPetRef = useRef();

	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [getDistrict, setGetDistrict] = useState(false);
	const [getHomelet, setGetHomelet] = useState(false);

	const { hotelId } = useParams();
	const hotelDetailState = useQuery({
		queryKey: ["hotel", hotelId],
		queryFn: async () => {
			return getDetailHotel(hotelId);
		},
		staleTime: 3 * 60 * 1000,
	});
	// ---------------------------------------------------------------------------
	const categoriesState = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	});
	let categories = [];
	if (categoriesState.isSuccess) {
		categories = categoriesState.data.category;
	}

	const hotelProvince = useQuery({
		queryKey: ["hotelProvince"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.province);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});
	const hotelDistrict = useQuery({
		queryKey: ["hotelDistrict"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.district + provinceRef.current.value);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		enabled: getDistrict,
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});
	const hotelHomelet = useQuery({
		queryKey: ["hotelHomelet"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.homelet + districtRef.current.value);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		enabled: getHomelet,
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});

	let provinces = [];
	if (hotelProvince.isSuccess) {
		provinces = hotelProvince.data.data;
	}
	let districts = [];
	if (hotelDistrict.isSuccess) {
		districts = hotelDistrict.data.data;
	}
	let homelets = [];
	if (hotelHomelet.isSuccess) {
		homelets = hotelHomelet.data.data;
	}
	const handleProvinceChange = (e) => {
		const value = e.target.value;
		if (value !== "undefined") {
			if (!getDistrict) {
				setGetDistrict(true);
			}
			districtRef.current.disabled = false;
			hotelDistrict.refetch();
		} else {
			if (getDistrict) {
				setGetDistrict(false);
			}
			districtRef.current.disabled = true;
			districtRef.current.value = undefined;
		}
		homeletRef.current.disabled = true;
		homeletRef.current.value = undefined;
	};
	const handleDistrictChange = (e) => {
		const value = e.target.value;
		if (value !== "undefined") {
			if (!getDistrict) {
				setGetHomelet(true);
			}
			homeletRef.current.disabled = false;
			hotelHomelet.refetch();
		} else {
			if (getDistrict) {
				setGetHomelet(false);
			}
			homeletRef.current.disabled = true;
			homeletRef.current.value = undefined;
		}
	};
	let hotel = {};
	if (hotelDetailState.isSuccess && hotelDetailState.data.success) {
		hotel = hotelDetailState.data.hotelDto;
	} else {
		return null;
	}
	const handleUpdate = async (e) => {
		e.preventDefault();
		if (provinceRef.current.value === "undefined") {
			provinceRef.current.focus();
			provinceRef.current.classList.add("is-invalid");
			return;
		} else {
			provinceRef.current.classList.remove("is-invalid");
		}
		if (districtRef.current.value === "undefined") {
			districtRef.current.focus();
			districtRef.current.classList.add("is-invalid");
			return;
		} else {
			districtRef.current.classList.remove("is-invalid");
		}
		if (homeletRef.current.value === "undefined") {
			homeletRef.current.focus();
			homeletRef.current.classList.add("is-invalid");
			return;
		} else {
			homeletRef.current.classList.remove("is-invalid");
		}
		let homeletId = homeletRef.current.value;
		if (homeletRef.current.value === "undefined") {
			homeletId = hotel.homeletId;
		}
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		const formData = new FormData();
		const today = new Date();
		formData.append("Id", hotelId);
		formData.append("Name", nameRef.current.value);
		formData.append("Star", hotel.star === "NaN" ? 5 : hotel.star);
		formData.append("Description", descriptionRef.current.value);
		formData.append("Address", addressRef.current.value);
		formData.append("Logo", avatarRef.current);
		formData.append("Slug", slugRef.current.value);
		formData.append("CreatedDate", hotel.createdDate);
		formData.append("UpdateDate", today.toISOString());
		formData.append("USerId", currentUser.id);
		formData.append("HotelCategoryId", categoryRef.current.value);
		formData.append("HotelBenefitId", hotel.hotelBenefit.id);
		formData.append("HomeletId", homeletId);
		formData.append("Resttaurant", restaurantRef.current.checked);
		formData.append("AllTimeFrontDesk", _24hRef.current.checked);
		formData.append("Elevator", elevatorRef.current.checked);
		formData.append("Pool", poolRef.current.checked);
		formData.append("FreeBreakfast", freeBreakfastRef.current.checked);
		formData.append("AirConditioner", airConditionerRef.current.checked);
		formData.append("CarBorow", lendingCarRef.current.checked);
		formData.append("WifiFree", wifiFreeRef.current.checked);
		formData.append("Parking", parkingRef.current.checked);
		formData.append("AllowPet", allowPetRef.current.checked);
		try {
			const res = await axiosJwt.put(url.updateHotel, formData, {
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.data.success) {
				hotelDetailState.refetch();
				toast.update(toastId, {
					render: res.data.message,
					type: "success",
					closeButton: true,
					autoClose: 1000,
					isLoading: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.update(toastId, {
				render: "Không thể cập nhật!",
				type: "error",
				closeButton: true,
				autoClose: 1000,
				isLoading: false,
			});
		}
	};
	setTimeout(() => {
		// if (hotelDetailState.isSuccess) {
		// 	var event = new Event("change");
		// 	provinceRef.current.dispatchEvent(event);
		// }
	}, 1000);
	return (
		<>
			<div
				className="modal fade"
				id={"hotel" + hotel.id}
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby={"hotel" + hotel.id + "Label"}
				aria-hidden="true">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id={"hotel" + hotel.id + "Label"}>
								Ảnh khách sạn
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="d-flex justify-content-center">
								<img
									style={{
										width: 550,
										height: 360,
										objectFit: "contain",
									}}
									src={hotel.logoLink}
								/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-light rounded h-100 p-5">
				<div className="d-flex justify-content-between">
					<h4 className="mb-4">Cập nhật khách sạn</h4>
					<div className="">
						<Link
							to={routes.hotel + "/" + hotel.id + "/room"}
							className={`btn mx-1 ${hotel.approval ? "btn-outline-primary " : " btn-secondary disabled"}`}>
							Xem phòng
						</Link>
						<Link
							to={routes.hotel + "/" + hotel.id + "/booking"}
							className={`btn mx-1 ${hotel.approval ? "btn-outline-primary " : " btn-secondary disabled"}`}>
							Xem đơn đặt phòng
						</Link>
					</div>
				</div>
				<form onSubmit={handleUpdate}>
					<HorizontalInput label={"Tên khách sạn"} ref={nameRef} required={true} defaultValue={hotel.name} />
					<TextAreaMe label={"Mô tả"} ref={descriptionRef} required={true} defaultValue={hotel.description} />
					<HorizontalInput label={"Địa chỉ"} ref={addressRef} required={true} defaultValue={hotel.address} />
					<div className="row mb-3">
						<label htmlFor="" className="col-sm-3 col-form-label">
							Hình ảnh
						</label>
						<div className="col-sm-9">
							<input
								// required
								onChange={(e) => {
									avatarRef.current = e.target.files[0];
								}}
								placeholder="avatarRef"
								// defaultValue={hotel.logoLink}
								className="form-control"
								type="file"
								id="formFile"
								accept="image/*"
							/>
							<button
								type="button"
								className="btn btn-outline-info mt-2"
								data-bs-toggle="modal"
								data-bs-target={"#hotel" + hotel.id}>
								Xem ảnh hiện tại
							</button>
						</div>
					</div>
					<HorizontalInput label={"Slug"} ref={slugRef} required={true} defaultValue={hotel.slug} />
					<HorizontalSelect label={"Loại khách sạn"} ref={categoryRef} defaultValue={hotel.hotelCategory.id}>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</HorizontalSelect>
					<HorizontalSelect
						label={"Tỉnh/Thành phố"}
						ref={provinceRef}
						defaultValue={hotel.provineId}
						required={true}
						onChange={handleProvinceChange}>
						<option value="undefined">Chọn tỉnh/thành phố</option>
						{provinces?.map((province) => (
							<option key={province.id} value={province.id}>
								{province.name}
							</option>
						))}
					</HorizontalSelect>
					<HorizontalSelect
						label={"Quận/Huyện"}
						ref={districtRef}
						required={true}
						defaultValue={hotel.districtId}
						// disable={true}
						onChange={handleDistrictChange}>
						<option value="undefined">Chọn quận/huyện</option>
						{districts?.length > 0
							? districts?.map((district) => (
									<option key={district.id} value={district.id}>
										{district.name}
									</option>
							  ))
							: hotel.districts.map((district) => (
									<option key={district.id} value={district.id}>
										{district.name}
									</option>
							  ))}
					</HorizontalSelect>
					<HorizontalSelect
						label={"Xã/Phường"}
						// required={true}
						// disable={true}
						defaultValue={hotel.homeletId}
						ref={homeletRef}>
						<option value="undefined">Chọn xã/phường</option>
						{homelets?.length > 0
							? homelets?.map((homelet) => (
									<option key={homelet.id} value={homelet.id}>
										{homelet.name}
									</option>
							  ))
							: hotel.homelets.map((homelet) => (
									<option key={homelet.id} value={homelet.id}>
										{homelet.name}
									</option>
							  ))}
					</HorizontalSelect>

					{/* Benefit khong can */}
					<fieldset className="row mb-3">
						<legend className="col-form-label col-sm-3 pt-0">Tiện ích khách sạn</legend>
						<div className="col-sm-9">
							<Checkbox label={"Nhà hàng"} ref={restaurantRef} defaultChecked={hotel.hotelBenefit.resttaurant} />
							<Checkbox label={"Lễ tân 24h"} ref={_24hRef} defaultChecked={hotel.hotelBenefit.allTimeFrontDesk} />
							<Checkbox label={"Thang máy"} ref={elevatorRef} defaultChecked={hotel.hotelBenefit.elevator} />
							<Checkbox label={"Bể bơi"} ref={poolRef} defaultChecked={hotel.hotelBenefit.pool} />
							<Checkbox
								label={"Bữa sáng miễn phí"}
								ref={freeBreakfastRef}
								defaultChecked={hotel.hotelBenefit.freeBreakfast}
							/>
							<Checkbox
								label={"Máy điều hòa"}
								ref={airConditionerRef}
								defaultChecked={hotel.hotelBenefit.airConditioner}
							/>
							<Checkbox label={"Thuê xe"} ref={lendingCarRef} defaultChecked={hotel.hotelBenefit.carBorow} />
							<Checkbox label={"Wifi free"} ref={wifiFreeRef} defaultChecked={hotel.hotelBenefit.wifiFree} />
							<Checkbox label={"Chỗ đậu xe"} ref={parkingRef} defaultChecked={hotel.hotelBenefit.parking} />
							<Checkbox
								label={"Cho phép dắt thú cưng"}
								ref={allowPetRef}
								defaultChecked={hotel.hotelBenefit.allowPet}
							/>
						</div>
					</fieldset>
					<div className="row mb-3">
						<label htmlFor="" className="col-sm-3 col-form-label"></label>
						<div className="col-sm-9">
							<button type="submit" className="btn btn-primary">
								Cập nhật
							</button>
							<button
								type="button"
								onClick={() => {
									navigate(-1);
								}}
								className="ms-3 btn btn-danger">
								Hủy
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
