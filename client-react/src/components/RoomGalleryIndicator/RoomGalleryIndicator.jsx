import { useState } from "react";

export default function RoomGalleryIndicator({ room, currentIndex, handleClick }) {
	return (
		<div className="d-flex justify-content-center mt-4">
			{room.hotelImageGalleries.map((value, index) => (
				<button
					key={index}
					type="button"
					onClick={() => {
						handleClick(index);
					}}
					data-bs-target={`#room-${room.id}-room`}
					data-bs-slide-to={index}
					className={`rounded mx-1 ${currentIndex === index ? "active" : ""}`}
					// className="mx-1"
					aria-current="true"
					aria-label={`Slide ${index + 1}`}>
					<img
						src={value.link}
						style={{
							width: "60px",
							height: "60px",
							objectFit: "cover",
						}}
						className="rounded"
						alt=""
					/>
				</button>
			))}
		</div>
	);
}
