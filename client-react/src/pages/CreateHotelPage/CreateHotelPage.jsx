import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import HorizontalInput from "../../components/HorizontalInput";
import HorizontalSelect from "../../components/HorizontalSelect";
import Checkbox from "../../components/Checkbox";
import TextAreaMe from "../../components/TextAreaMe";
import { getCategories } from "../../services/categoryServices";

export default function CreateHotelPage() {
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
			homeletRef.current.disabled = true;
			homeletRef.current.value = undefined;
		}
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
	const handlePost = async (e) => {
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
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		const formData = new FormData();
		const today = new Date();
		formData.append("id", 0);
		formData.append("name", nameRef.current.value);
		formData.append("star", 0);
		formData.append("description", descriptionRef.current.value);
		formData.append("address", addressRef.current.value);
		formData.append("logo", avatarRef.current);
		formData.append("slug", slugRef.current.value);
		formData.append("createdDate", today.toISOString());
		formData.append("updateDate", today.toISOString());
		formData.append("uSerId", currentUser.id);
		formData.append("hotelCategoryId", categoryRef.current.value);
		formData.append("hotelBenefitId", 0);
		formData.append("homeletId", homeletRef.current.value);
		formData.append("resttaurant", restaurantRef.current.checked);
		formData.append("allTimeFrontDesk", _24hRef.current.checked);
		formData.append("elevator", elevatorRef.current.checked);
		formData.append("pool", poolRef.current.checked);
		formData.append("freeBreakfast", freeBreakfastRef.current.checked);
		formData.append("airConditioner", airConditionerRef.current.checked);
		formData.append("carBorrow", lendingCarRef.current.checked);
		formData.append("wifiFree", wifiFreeRef.current.checked);
		formData.append("parking", parkingRef.current.checked);
		formData.append("allowPet", allowPetRef.current.checked);
		try {
			const res = await axiosJwt.post(url.createHotel, formData, {
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.data.success) {
				e.target.reset();
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
				render: "Không thể tạo! Khách sạn chưa được duyệt!",
				type: "error",
				closeButton: true,
				autoClose: 1000,
				isLoading: false,
			});
		}
	};
	return (
		<div className="bg-light rounded h-100 p-5">
			<h4 className="mb-4">Thêm khách sạn</h4>
			<form onSubmit={handlePost}>
				<HorizontalInput label={"Tên khách sạn"} ref={nameRef} required={true} />
				<TextAreaMe label={"Mô tả"} ref={descriptionRef} required={true} />
				<HorizontalInput label={"Địa chỉ"} ref={addressRef} required={true} />
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Hình ảnh
					</label>
					<div className="col-sm-9">
						<input
							required
							onChange={(e) => {
								avatarRef.current = e.target.files[0];
							}}
							placeholder=""
							className="form-control"
							type="file"
							id="formFile"
							accept="image/*"
						/>
					</div>
				</div>
				<HorizontalInput label={"Slug"} ref={slugRef} required={true} />
				<HorizontalSelect label={"Loại khách sạn"} ref={categoryRef}>
					{categories.map((category) => (
						<option key={category.id} defaultChecked={category.id === 1 ? true : false} value={category.id}>
							{category.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalSelect label={"Tỉnh/Thành phố"} ref={provinceRef} required={true} onChange={handleProvinceChange}>
					<option defaultChecked value="undefined">
						Chọn tỉnh/thành phố
					</option>
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
					disable={true}
					onChange={handleDistrictChange}>
					<option defaultChecked value="undefined">
						Chọn quận/huyện
					</option>
					{districts?.map((district) => (
						<option key={district.id} value={district.id}>
							{district.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalSelect label={"Xã/Phường"} ref={homeletRef} required={true} disable={true}>
					<option value="undefined" defaultChecked>
						Chọn xã/phường
					</option>
					{homelets?.map((homelet) => (
						<option key={homelet.id} value={homelet.id}>
							{homelet.name}
						</option>
					))}
				</HorizontalSelect>
				{/* Benefit khong can */}
				<fieldset className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Tiện ích khách sạn</legend>
					<div className="col-sm-9">
						<Checkbox label={"Nhà hàng"} ref={restaurantRef} />
						<Checkbox label={"Lễ tân 24h"} ref={_24hRef} />
						<Checkbox label={"Thang máy"} ref={elevatorRef} />
						<Checkbox label={"Bể bơi"} ref={poolRef} />
						<Checkbox label={"Bữa sáng miễn phí"} ref={freeBreakfastRef} />
						<Checkbox label={"Máy điều hòa"} ref={airConditionerRef} />
						<Checkbox label={"Thuê xe"} ref={lendingCarRef} />
						<Checkbox label={"Wifi free"} ref={wifiFreeRef} />
						<Checkbox label={"Chỗ đậu xe"} ref={parkingRef} />
						<Checkbox label={"Cho phép dắt thú cưng"} ref={allowPetRef} />
					</div>
				</fieldset>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label"></label>
					<div className="col-sm-9">
						<button type="submit" className="btn btn-primary">
							Thêm mới
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
	);
}
