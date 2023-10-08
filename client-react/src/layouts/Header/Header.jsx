import { useDispatch, useSelector } from "react-redux";
import reactLogo from "../../assets/react.svg";
import { logout } from "../../services/userServices";
import { selectUser } from "../../redux/selectors";

export default function Header() {
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();
	const handleLogout = (e) => {
		e.preventDefault();
		logout(dispatch);
	};
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
						$(".sidebar, .content").toggleClass("open");
						return false;
					}}
					className="sidebar-toggler flex-shrink-0">
					<i className="fa fa-bars" />
				</a>
				<form className="d-none d-md-flex ms-4">
					<input className="form-control border-0" type="search" placeholder="Search" />
				</form>
				<div className="navbar-nav align-items-center ms-auto">
					<div className="nav-item dropdown">
						<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
							<img
								className="rounded-circle me-lg-2"
								src={currentUser.avatar || reactLogo}
								alt=""
								style={{ width: 40, height: 40 }}
								onError={(e) => {
									e.target.src = reactLogo;
								}}
							/>
							<span className="d-none d-lg-inline-flex">{currentUser.firstName + " " + currentUser.lastName}</span>
						</a>
						<div className="dropdown-menu dropdown-menu-end bg-white border rounded m-0">
							<a href="#" className="dropdown-item">
								Cài đặt
							</a>
							<a onClick={handleLogout} href="#" className="dropdown-item">
								Đăng xuất
							</a>
						</div>
					</div>
				</div>
			</nav>
			{/* Navbar End */}
		</>
	);
}
