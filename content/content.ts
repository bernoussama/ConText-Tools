import { Tool, CustomTool } from "./actions";
import { promptGemini } from "./gemini";

const tools: Tool[] = [];

const moreProfessional = new CustomTool(
	"morePro",
	"more professional",
	"make it more professional",
);

const fixTypos = new CustomTool(
	"fixTypos",
	"Fix typos",
	"fix typos and grammar",
);

const upperCaseText = new Tool("uppercase", "Upppercase");
upperCaseText.modifyText = (selectedText: string) => {
	return selectedText.toUpperCase();
};
const lowerCaseText = new Tool("lowercase", "Lowercase");
lowerCaseText.modifyText = (selectedText: string) => {
	return selectedText.toLowerCase();
};
const capitalizeText = new Tool("capitalize", "Capitalize");
capitalizeText.modifyText = (selectedText: string) => {
	return (
		selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase()
	);
};

tools.push(upperCaseText, lowerCaseText, capitalizeText);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	console.log(
		sender.tab
			? `from a content script:${sender.tab.url}`
			: "from the extension",
	);
	if (request.menuId) {
		// await getTools();
		let action = tools.find((menu) => menu.id === request.menuId);
		if (!action) {
			action = new CustomTool(
				request.menuID,
				request.menuTitle,
				request.menuPrompt,
			);
		}
		console.log(request.menuId);
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			// const range = selection.getRangeAt(0);
			// range.deleteContents();
			const systemPrompt = moreProfessional.systemPrompt;
			const userPrompt = selection?.toString();
			// const modifiedText = await promptGemini(systemPrompt, userPrompt);
			const modifiedText = action
				? await action.modifyText(userPrompt)
				: userPrompt;
			document.execCommand("insertText", false, modifiedText);
			// range.insertNode(document.createTextNode(modifiedText));
		}
		sendResponse({ farewell: "goodbye" });
	}
});
