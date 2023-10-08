import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { renderRoutes } from "./utils/helpers";
import { privateRoutes, publicRoutes, routes } from "./routes/routes";
import { selectUser } from "./redux/selectors";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAWtbaNqvxWbKwa27tdikdqRh0KczzCpfc",
	authDomain: "admin-hotel-de965.firebaseapp.com",
	projectId: "admin-hotel-de965",
	storageBucket: "admin-hotel-de965.appspot.com",
	messagingSenderId: "660651554488",
	appId: "1:660651554488:web:cba6278d4fbf9207caa64d",
	measurementId: "G-NT9DLYJM31",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);

const ProtectedRoute = ({ redirectPath = "/sign-in" }) => {
	const currentUser = useSelector(selectUser);
	const currentPathName = window.location.pathname;
	if (!currentUser) {
		return <Navigate to={`${redirectPath}?next=${encodeURIComponent(currentPathName)}`} replace />;
	}
	return <Outlet />;
};

function App() {
	return (
		<BrowserRouter>
			<ToastContainer />
			<Routes>
				<Route path="/" element={<Navigate to={routes.signIn} />} />
				{renderRoutes(publicRoutes)}
				{<Route element={<ProtectedRoute />}>{renderRoutes(privateRoutes)}</Route>}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
