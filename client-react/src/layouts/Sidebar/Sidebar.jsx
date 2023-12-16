import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../redux/selectors";
import { routes } from "../../routes";
import { CONST } from "../../utils/const";
import { useEffect, useId, useRef, useState } from "react";
import { generateUniqueId } from "../../utils/helpers";
import "./Sidebar.css";

export default function Sidebar() {
	const currentUser = useSelector(selectUser);
	const permissions = [];
	(currentUser?.permissions || []).forEach((item) => permissions.push(item.name));
	const sideBarValue = CONST.SIDEBAR;
	const id = "sideBarId";
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [collapse, setCollapse] = useState([]);
	const dropDownClass = "fa-solid fa-chevron-down sidebar-dropdown-collapse";
	const HAS_ADMIN_PERMISSION = permissions.some((p) => p === CONST.PERMISSION.ADMIN);
	function toggleDropdown(index) {
		if (collapse.includes(index)) {
			let tmp = collapse.filter((item) => item !== index);
			setCollapse(tmp);
		} else {
			setCollapse([...collapse, index]);
		}
	}
	function onSelectedItem(index) {
		setSelectedIndex(index);
	}
	function checkPermission(permission, userPermissions) {
		return permission.every((item) => userPermissions.includes(item));
	}
	var currentUrl = window.location.pathname;
	return (
		<>
			{/* Sidebar Start */}
			<div className="sidebar pb-3 app-sidebar">
				<nav className="navbar p-0">
					<Link
						to={HAS_ADMIN_PERMISSION ? routes.OVERVIEW : routes.SUBJECT}
						className="navbar-brand m-0 bg-red w-100 ps-4">
						<img src="/public/img/ptit-logo.jpg" alt="logo" style={{ height: "100%" }} />
					</Link>
					<div className="navbar-nav w-100 custom-nav-border">
						{sideBarValue.map((item, index) => {
							if (item.childs?.length > 0) {
								return checkPermission(item.permissions, permissions) ? (
									<ul className="list-unstyled ps-0 m-0" key={index}>
										<li>
											<button
												onClick={($event) => toggleDropdown(index)}
												className="btn-toggle nav-item nav-link active w-100 sidebar-btn-collapse"
												data-bs-toggle="collapse"
												data-bs-target={"#" + id + index}
												aria-expanded="false">
												<i className={item.icon}></i> {item.name}
												<i
													className={collapse.includes(index) ? dropDownClass + " dropdown-revert" : dropDownClass}></i>
											</button>
											<div className="collapse" id={id + index}>
												<ul className="btn-toggle-nav list-unstyled">
													{item.childs?.map((child, childIndex) =>
														checkPermission(child.permissions, permissions) ? (
															<li
																onClick={(e) => onSelectedItem(`${index.toString()}${childIndex.toString()}`)}
																key={`${index.toString()}${childIndex.toString()}`}
																className="sidebar-item-collapse">
																<Link
																	to={child.route}
																	className={
																		child.route === currentUrl
																			? "nav-item nav-link active selected-item"
																			: "nav-item nav-link active"
																	}>
																	{child.name}
																</Link>
															</li>
														) : null,
													)}
												</ul>
											</div>
										</li>
									</ul>
								) : null;
							} else {
								return checkPermission(item.permissions, permissions) ? (
									<Link
										onClick={(e) => onSelectedItem(index.toString())}
										to={item.route}
										className={
											item.route === currentUrl ? "nav-item nav-link active selected-item" : "nav-item nav-link active"
										}
										key={index}>
										<i className={item.icon}></i> {item.name}
									</Link>
								) : null;
							}
						})}
					</div>
				</nav>
			</div>
			{/* Sidebar End */}
		</>
	);
}
