import { useState } from "react";
import RoomGalleryIndicator from "../RoomGalleryIndicator/RoomGalleryIndicator";

export default function RoomGallery({ room }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const handleClick = (index) => {
		setCurrentIndex(index);
	};
	const prevClick = () => {
		if (currentIndex === 0) {
			setCurrentIndex(room.hotelImageGalleries.length - 1);
		} else {
			setCurrentIndex((ci) => ci - 1);
		}
	};
	const nextClick = () => {
		if (currentIndex === room.hotelImageGalleries.length - 1) {
			setCurrentIndex(0);
		} else {
			setCurrentIndex((ci) => ci + 1);
		}
	};
	return (
		<>
			<div id={`room-${room.id}-room`} className="carousel slide">
				<div
					className="carousel-inner d-flex flex-column"
					style={{
						width: "100%",
						height: "360px",
					}}>
					{room.hotelImageGalleries.map((value, index) => (
						<div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
							<img
								src={value.link}
								style={{
									width: "100%",
									height: "360px",
									objectFit: "cover",
								}}
								className="d-block rounded"
								alt="..."
							/>
						</div>
					))}
				</div>
				<button
					className="carousel-control-prev"
					type="button"
					onClick={prevClick}
					data-bs-target={`#room-${room.id}-room`}
					data-bs-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Previous</span>
				</button>
				<button
					className="carousel-control-next"
					onClick={nextClick}
					type="button"
					data-bs-target={`#room-${room.id}-room`}
					data-bs-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Next</span>
				</button>
			</div>
			<RoomGalleryIndicator room={room} currentIndex={currentIndex} handleClick={handleClick} />
		</>
	);
}
