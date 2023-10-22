// useRouteGuard.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "../redux/selectors";

export function useRouteGuard(requiredPermission, userPermissions) {
	const location = useLocation();
	const navigate = useNavigate();
	console.log(userPermissions);
	useEffect(() => {
		console.log("check permission");
		// Check permissions here based on requiredPermission and user's permissions
		const hasPermission = checkUserPermission(requiredPermission, userPermissions);

		if (!hasPermission) {
			// Redirect the user or display an error message
			navigate("/unauthorize");
		}
	}, []);
	//location, requiredPermission, navigate
}

function checkUserPermission(requiredPermission, userPermissions) {
	const permissions = [];
	userPermissions.forEach((item) => permissions.push(item.name));
	return requiredPermission.every((item) => permissions.includes(item));
}
