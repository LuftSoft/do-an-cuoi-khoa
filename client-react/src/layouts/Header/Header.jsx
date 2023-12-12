import { useDispatch, useSelector } from "react-redux";
import reactLogo from "../../assets/default_avatar.png";
import { logout } from "../../services/userServices";
import { selectUser } from "../../redux/selectors";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function toggleButtonClasses() {
	$(".sidebar, .content").toggleClass("open");
}
export default function Header() {
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();
	const handleLogout = (e) => {
		e.preventDefault();
		logout(dispatch);
	};
	useEffect(() => {
		console.log("user is change");
	}, [useSelector(selectUser)]);
	return (
		<>
			{/* Navbar Start */}
			<nav className="navbar navbar-expand app-navbar navbar-light sticky-top px-4 py-0">
				<a href="/hotel" className="navbar-brand d-flex d-lg-none me-4">
					<h2 className="text-primary mb-0">
						<i className="fa fa-hashtag" />
					</h2>
				</a>
				<a
					href="#"
					onClick={(e) => {
						e.preventDefault();
						toggleButtonClasses();
						return false;
					}}
					className="sidebar-toggler flex-shrink-0">
					<i className="fa fa-bars" />
				</a>
				{/* <form className="d-none d-md-flex ms-4">
					<input className="form-control border-0" type="search" placeholder="Search" />
				</form> */}
				<div className="navbar-nav align-items-center ms-auto">
					<div className="nav-item dropdown">
						<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
							<i className="fa-solid fa-circle-user" style={{ fontSize: 40 }}></i>
						</a>
						<div className="dropdown-menu dropdown-menu-end bg-white border rounded m-0">
							<span className="dropdown-item" style={{ borderBottom: "1px solid black" }}>
								{currentUser.firstName + " " + currentUser.lastName}
							</span>
							<Link to={"/setting"} className="dropdown-item">
								<i class="fa-solid fa-gear me-2"></i>Cài đặt
							</Link>
							<Link to={"/change-password"} className="dropdown-item">
								<i class="fa-solid fa-key me-2"></i>Đổi mật khẩu
							</Link>
							<a onClick={handleLogout} href="#" className="dropdown-item">
								<i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất
							</a>
						</div>
					</div>
				</div>
			</nav>
			{/* Navbar End */}
		</>
	);
}
