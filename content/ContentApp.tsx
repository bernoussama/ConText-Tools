import React from "react";
import reactLogo from "../public/react.png";
import tailwindBg from "../public/tailwind_bg.png";
import typescriptLogo from "../public/typescript.png";
import tailwindLogo from "../public/tailwind.png";
import chromeWindowBg from "../public/chromeWindow.png";
import Tools from "./Tools";

export default function ContentApp() {
	const [isdialogOpen, setIsDialogOpen] = React.useState(false);

	if (!isdialogOpen) {
		return (
			<div className="mx-auto p-6">
				<button
					type="button"
					onMouseDown={() => setIsDialogOpen(true)}
					className="bg-white rounded-md p-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					🧩
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl md:px-0 lg:p-6">
			<Tools />

			<button
				type="button" // {{ edit_1 }}
				onMouseDown={() => setIsDialogOpen(false)}
				className="underline hover:no-underline
            "
			>
				closing this hint
			</button>
		</div>
	);
}
