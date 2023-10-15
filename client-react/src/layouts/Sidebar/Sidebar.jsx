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
	const sideBarValue = CONST.SIDEBAR;
	const id = "sideBarId";
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [collapse, setCollapse] = useState([]);
	const dropDownClass = "fa-solid fa-chevron-down sidebar-dropdown-collapse";
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
	var currentUrl = window.location.pathname;
	return (
		<>
			{/* Sidebar Start */}
			<div className="sidebar pb-3 app-sidebar">
				<nav className="navbar p-0">
					<a href={routes.hotel} className="navbar-brand m-0 bg-red w-100 ps-4">
						<h3 className="text-default">Trang chủ</h3>
					</a>
					<div className="navbar-nav w-100">
						{sideBarValue.map((item, index) => {
							if (item.childs?.length > 0) {
								return (
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
													{item.childs?.map((child, childIndex) => {
														return (
															<li
																onClick={(e) => onSelectedItem(`${index.toString()}${childIndex.toString()}`)}
																key={`${index.toString()}${childIndex.toString()}`}
																className="sidebar-item-collapse">
																<Link
																	to={child.route}
																	className={
																		child.route.includes(currentUrl)
																			? "nav-item nav-link active selected-item"
																			: "nav-item nav-link active"
																	}>
																	{child.name}
																</Link>
															</li>
														);
													})}
												</ul>
											</div>
										</li>
									</ul>
								);
							} else {
								return (
									<Link
										onClick={(e) => onSelectedItem(index.toString())}
										to={item.route}
										className={
											item.route.includes(currentUrl)
												? "nav-item nav-link active selected-item"
												: "nav-item nav-link active"
										}
										key={index}>
										<i className={item.icon}></i> {item.name}
									</Link>
								);
							}
						})}
					</div>
				</nav>
			</div>
			{/* Sidebar End */}
		</>
	);
}
