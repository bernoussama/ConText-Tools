import React from "react";
import ReactDOM from "react-dom/client";
import MyExtension from "./MyExtension";
import "./output.css";

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(
	<React.StrictMode>
		<MyExtension />
	</React.StrictMode>,
);

// Load the API key if it exists
chrome.storage.local.get("apiKey", (result) => {
	if (result.apiKey) {
		const apiKeyInput = document.getElementById("apiKey");
		if (apiKeyInput) {
			(apiKeyInput as HTMLInputElement).value = result.apiKey; // Cast to HTMLInputElement
		}
	}
});
