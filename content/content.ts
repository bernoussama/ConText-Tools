import { Action, CustomAction } from "./actions";
import { promptGemini } from "./gemini";
console.log("hello from content");

const moreProfessional = new CustomAction(
	"morePro",
	"more professional",
	"make it more professional",
);

const fixTypos = new CustomAction(
	"fixTypos",
	"Fix typos",
	"fix typos and grammar",
);

let actions: Action[] = [];

const upperCaseText = new Action("uppercase", "Upppercase");
upperCaseText.modifyText = (selectedText: string) => {
	return selectedText.toUpperCase();
};
const lowerCaseText = new Action("lowercase", "Lowercase");
lowerCaseText.modifyText = (selectedText: string) => {
	return selectedText.toLowerCase();
};
const capitalizeText = new Action("capitalize", "Capitalize");
capitalizeText.modifyText = (selectedText: string) => {
	return (
		selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase()
	);
};

actions.push(
	moreProfessional,
	upperCaseText,
	lowerCaseText,
	capitalizeText,
	fixTypos,
);

chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		console.log(
			sender.tab
				? "from a content script:" + sender.tab.url
				: "from the extension",
		);
		if (request.menuId) {
			const action = actions.find((menu) => menu.id === request.menuId);
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
	},
);
