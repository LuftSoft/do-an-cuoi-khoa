import { useRef, useState } from "react";
import { routes } from "../../routes";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helpers";
import { toast } from "react-toastify";
import { axiosPost, url } from "../../utils/httpRequest";

const initState = {
	email: "",
	password: "",
};

export default function ForgotPasswordPage() {
	const emailRef = useRef();
	const navigate = useNavigate();
	const [errors, setErrors] = useState(initState);
	const handleSubmit = (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const errors = {};
		validateEmail(errors, email);
		if (Object.keys(errors).length) {
			setErrors(errors);
		} else {
			setErrors({
				...initState,
			});
			const sendMail = async () => {
				const toastId = toast.loading("Đang xử lý!");
				try {
					const res = await axiosPost(url.forgotPassword, {
						email,
						url: window.location.host + "/reset-password?token=",
					});
					toast.update(toastId, {
						render: "Đã gửi liên kết đến địa chỉ email của bạn!",
						type: "success",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
				} catch (error) {
					console.log(error);
					toast.update(toastId, {
						render: error.response.data.message,
						type: "error",
						closeButton: true,
						autoClose: 3000,
						isLoading: false,
					});
				}
			};
			sendMail();
		}
	};
	const handleChange = (name) => {
		setErrors({
			...errors,
			[name]: "",
		});
	};
	const handleBack = () => {
		navigate(-1);
	};
	return (
		<div className="container-xxl bg-white d-flex p-0">
			<div className="container-fluid">
				<div className="row h-100 min-vh-100 align-items-center justify-content-center">
					<div className="col-12 col-sm-8 col-md-6 col-lg-5">
						<form onSubmit={handleSubmit} className="bg-light bg-gradient rounded p-3 p-sm-4 my-4 mx-3">
							<div className="d-flex align-items-center justify-content-between mb-3">
								<Link to={routes.home}>
									<h4 className="text-primary text-uppercase">
										<i className="fa-solid fa-house"></i>
									</h4>
								</Link>
								<h4>Quên mật khẩu</h4>
							</div>
							<div className="mb-3">
								<label htmlFor="Username" className="form-label">
									Địa chỉ Email
								</label>
								<input
									ref={emailRef}
									onChange={() => {
										handleChange("email");
									}}
									className={`form-control ${errors.email ? "is-invalid" : ""}`}
									id="Username"
									type="email"
								/>
								<div className="invalid-feedback">{errors.email}</div>
								<p className="mt-2">
									Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn.
								</p>
							</div>

							<div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4"></div>
							<button type="submit" className="btn btn-primary w-100 mb-4">
								Gửi Email
							</button>
							<button type="button" onClick={handleBack} className="btn btn-outline-primary w-100 mb-4">
								Trở lại
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
