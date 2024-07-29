// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleGenerativeAI } from './node_modules/@google/generative-ai/dist/index.mjs';
// import { promptGemini } from "./gemini";
// import { CustomMenu } from "./menus";

console.log("Hello from the background script!");

const builtinMenus = [
	{ id: "uppercase", title: "Uppercase" },
	{ id: "lowercase", title: "Lowercase" },
	{ id: "capitalize", title: "Capitalize" },
	{ id: "morePro", title: "more professional" },
	{ id: "fixTypos", title: "Fix Typos" },
	{ id: "fixGrammar", title: "Fix Grammar", function: fixGrammar },
];

let customMenus: CustomMenu[] = [];

chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason !== "install" && details.reason !== "update") return;
	chrome.contextMenus.create({
		id: "sideKlickParent",
		title: "SideKlickCrxjs",
		contexts: ["selection"],
	});

	builtinMenus.forEach((menu) => {
		chrome.contextMenus.create({
			id: menu.id,
			parentId: "sideKlickParent",
			title: menu.title,
			contexts: ["selection"],
		});
	});
});
// chrome.runtime.onStartup(() => {});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const menuItem =
		builtinMenus.find((menu) => menu.id === info.menuItemId) ||
		customMenus.find((menu) => menu.id === info.menuItemId);
	if (menuItem) {
		if (tab && tab.id !== undefined) {
			(async () => {
				const [tab] = await chrome.tabs.query({
					active: true,
					lastFocusedWindow: true,
				});
				const response = await chrome.tabs.sendMessage(tab.id || 0, {
					menuId: menuItem.id,
				});
				// do something with response here, not outside the function
				console.log(response);
			})();
		}
	}
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(
		sender.tab
			? "from a content script:" + sender.tab.url
			: "from the extension",
	);
	if (request.id && request.title && request.prompt) {
		chrome.contextMenus.create({
			id: request.id,
			parentId: "sideKlickParent",
			title: request.title,
			contexts: ["selection"],
		});
		sendResponse({ status: "success" });
	}
});

async function fixTypos() {
	const selectedText = window.getSelection()?.toString();

	// Get the API key from storage
	chrome.storage.sync.get("apiKey", async (result) => {
		const apiKey = result.apiKey;
		if (!apiKey) {
			console.error("API key is not set");
			return;
		}
		const systemPrompt =
			"You are a writing assistant, you are given a text and you have to fix grammar and typos in that text IN THE SAME LANGUAGE AS THE INPUT and reply with ONLY THE FIXED TEXT";

		// Make the request to the Gemini API
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
		const data = {
			system_instruction: {
				parts: {
					text: systemPrompt,
				},
			},
			safetySettings: [{ category: 7, threshold: 4 }],
			contents: [
				{
					parts: [
						{
							text: `${selectedText}`,
						},
					],
				},
			],
		};

		let modifiedText: string | undefined = selectedText;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result = await response.json();
			console.log(result);
			modifiedText = result.candidates[0].content.parts[0].text.trim();
		} catch (error) {
			console.error("Error prompting Gemini:", error);
		}

		try {
			document.execCommand("insertText", false, modifiedText);
		} catch (error) {
			console.error("Error modifying text:", error);
		}
	});
}

async function fixGrammar() {
	const selectedText = window.getSelection()?.toString();
	const systemPrompt =
		"You are a writing assistant, you are given a text and you have to fix grammar in that text in the same language as the input and reply with ONLY the fixed text and NO ADDITIONAL WHITESPACE";

	console.log(`calling prompt gemini`);

	// const response = (await promptGemini(systemPrompt, selectedText || "")) || ""; // Ensure response is a string
	// (async () => {
	//   const response = await chrome.runtime.sendMessage({greeting: "hello"});
	//   // do something with response here, not outside the function
	//   console.log(response);
	// })();

	// document.execCommand("insertText", false, response);
}

class CustomMenu {
	id: string;
	title: string;
	// prompt: string;
	systemPrompt: string;

	constructor(id: string, title: string, prompt: string) {
		this.id = id;
		this.title = title;
		// this.prompt = prompt;
		this.systemPrompt = `You are a writing assistant, you are given a text and you have to ${prompt} in the same language as the input and reply with ONLY the fixed text`;
	}

	async function(): Promise<void> {
		const selectedText = window.getSelection()?.toString() || "";
		// const systemPrompt = `You are a writing assistant, you are given a text and you have to ${this.prompt} in the same language as the input and reply with ONLY the fixed text`;
		console.log(`system prompt: ${this.systemPrompt}`);
		// const response = await promptGemini(systemPrompt, selectedText);

		// Get the API key from storage
		chrome.storage.sync.get("apiKey", async (result) => {
			const apiKey = result.apiKey;
			if (!apiKey) {
				console.error("API key is not set");
				return;
			}

			// Make the request to the Gemini API
			const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
			const data = {
				system_instruction: {
					parts: {
						text: this.systemPrompt,
					},
				},
				safetySettings: [{ category: 7, threshold: 4 }],
				contents: [
					{
						parts: [
							{
								text: `${selectedText}`,
							},
						],
					},
				],
			};

			let modifiedText: string | undefined = selectedText;
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});
				const result = await response.json();
				console.log(result);
				modifiedText = result.candidates[0].content.parts[0].text.trim();
			} catch (error) {
				console.error("Error prompting Gemini:", error);
			}

			try {
				document.execCommand("insertText", false, modifiedText);
			} catch (error) {
				console.error("Error modifying text:", error);
			}
		});
		// document.execCommand("insertText", false, response);
	}
}

// const moreProfessional = new CustomMenu(
// 	"morePro",
// 	"more professional",
// 	"make it more professional",
// );

// customMenus.push(moreProfessional);

// chrome.contextMenus.update("sideClickParent", {}, () => {
// customMenus.forEach((menu) => {
// 	chrome.contextMenus.create({
// 		id: menu.id,
// 		// parentId: "sideKlickParent",
// 		title: menu.title,
// 		contexts: ["selection"],
// 	});
// });
// });
