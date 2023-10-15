import { Button } from "@mui/material";
import React, { useId } from "react";

const TitleButtonComponent = ({ title, buttons }) => {
	const id = useId();
	return (
		<div style={styles.container}>
			<div style={styles.title}>{title}</div>
			{buttons.map((button, index) => (
				<Button style={styles.button} variant="contained" onClick={button.onClick} key={id + index}>
					{button.name}
				</Button>
			))}
		</div>
	);
};

const styles = {
	container: {
		borderRadius: "4px",
		boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "10px",
		borderBottom: "1px solid #ccc",
		textTransform: "uppercase",
	},
	title: {
		flex: 1,
		fontWeight: "bold",
	},
};

export default TitleButtonComponent;
