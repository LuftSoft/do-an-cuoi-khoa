import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

export default function DefaultLayout({ children }) {
	return (
		<div className="position-relative bg-white d-flex p-0">
			<Sidebar />
			<div className="content">
				<Header />
				<div
					className="container-fluid pt-4 px-4"
					style={{
						minHeight: "calc(100vh - 64px)",
					}}>
					{children}
				</div>
				<div className="container-fluid pt-4 px-4">
					<Footer />
				</div>
			</div>
		</div>
	);
}
