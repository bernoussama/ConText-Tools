import React from "react";

export default function Pen() {
	return (
		<div
			style={{
				width: "10px",
				height: "10px",
				position: "absolute",
				backgroundColor: "lightyellow",
				padding: "5px",
				borderRadius: "5px",
				boxShadow: "0 0 5px #ccc",
				cursor: "pointer",
			}}
			onClick={() => console.log("Tooltip clicked")}
			onKeyUp={() => console.log("Tooltip key pressed")}
			// tabIndex={0}
		/>
	);
}
