export default function Footer() {
	return (
		<footer className="py-3 my-4 border-top">
			<div className="container d-flex flex-wrap justify-content-between align-items-center">
				<p className="col-md-4 mb-0 text-muted">&copy; 2023 PTITHCM, Ins</p>
				<ul className="nav col-md-4 justify-content-end">
					<li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Trang chủ</a></li>
					<li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Chính sách</a></li>
					<li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Giới thiệu</a></li>
					<li className="nav-item"><a href="#" className="nav-link px-2 text-muted">FAQs</a></li>
				</ul>
			</div>
		</footer>
	);
}
