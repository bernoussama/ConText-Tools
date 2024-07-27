// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleGenerativeAI } from './node_modules/@google/generative-ai/dist/index.mjs';

console.log("Hello from the background script!");

// async function promptGemini(systemPrompt: string, userPrompt: string): Promise<string> {
//     console.log("prompting gemini")
//     return new Promise((resolve) => {
//         chrome.storage.sync.get("apiKey", async (result) => {
//             const apiKey = result.apiKey;
//             if (!apiKey) {
//                 console.error("API key is not set");
//                 resolve(""); // Return empty string if no API key
//                 return;
//             }

//             const genAI = new GoogleGenerativeAI(apiKey);
//             const model = genAI.getGenerativeModel({
//                 model: "gemini-1.5-flash",
//                 systemInstruction: systemPrompt,
//             });

//             const res = await model.generateContent(userPrompt);
//             const response = await res.response;
//             const text = response.text();
//             console.log(`gemini response: ${text}`);
//             resolve(text); // Resolve with the generated text
//         });
//     });
// }

const builtinMenus = [
	{ id: "uppercase", title: "Uppercase", function: uppercaseSelectedText },
	{ id: "lowercase", title: "Lowercase", function: lowercaseSelectedText },
	{ id: "capitalize", title: "Capitalize", function: capitalizeSelectedText },
	{ id: "fixTypos", title: "Fix Typos", function: fixTypos },
	{ id: "fixGrammar", title: "Fix Grammar", function: fixGrammar },
];

let customMenus: CustomMenu[] = [];

class CustomMenu {
	id: string;
	title: string;
	prompt: string;
	function: () => Promise<void>; // Change 'function' to 'func' and specify the type

	constructor(id: string, title: string, prompt: string) {
		this.id = id;
		this.title = title;
		this.prompt = prompt;
		this.function = this.executeFunction;
	}

	async executeFunction() {
		const selectedText = window.getSelection()?.toString() || "";
		const systemPrompt = `You are a writing assistant, you are given a text and you have to ${this.prompt} in the same language as the input and reply with ONLY the fixed text`;
		console.log(`calling prompt gemini with custom prompt`);
		const response = await promptGemini(systemPrompt, selectedText);
		document.execCommand("insertText", false, response);
	}
}

chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason !== "install" && details.reason !== "update") return;
	chrome.contextMenus.create({
		id: "sideClickParent",
		title: "SideKlickCrxjs",
		contexts: ["selection"],
	});

	builtinMenus.forEach((menu) => {
		chrome.contextMenus.create({
			id: menu.id,
			parentId: "sideClickParent",
			title: menu.title,
			contexts: ["selection"],
		});
	});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	const menuItem =
		builtinMenus.find((menu) => menu.id === info.menuItemId) ||
		customMenus.find((menu) => menu.id === info.menuItemId);
	if (menuItem && menuItem.function) {
		try {
			if (tab && tab.id !== undefined) {
				// Ensure tab.id is defined
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					func: menuItem.function, // Change 'function' to 'func'
				});
			} else {
				console.error("Tab ID is undefined");
			}
		} catch (error) {
			console.error("Error executing function:", error);
		}
	}
});

async function uppercaseSelectedText() {
	const selectedText = window.getSelection()?.toString();
	document.execCommand("insertText", false, selectedText?.toUpperCase());
}

async function lowercaseSelectedText() {
	const selectedText = window.getSelection()?.toString();
	document.execCommand("insertText", false, selectedText?.toLowerCase());
}

async function capitalizeSelectedText() {
	const selectedText = window.getSelection()?.toString();
	const replacement =
		(selectedText?.charAt(0).toUpperCase() ?? "") +
		(selectedText?.slice(1).toLowerCase() ?? "");
	document.execCommand("insertText", false, replacement);
}

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

	const response = (await promptGemini(systemPrompt, selectedText || "")) || ""; // Ensure response is a string
	document.execCommand("insertText", false, response);
}

async function promptGemini(systemPrompt: string, selectedText: string) {
	console.log(`prompting gemini`);
	const apiKey = await chrome.storage.local.get("apiKey");
	if (!apiKey) {
		console.error("API key is not set");
		return;
	}
	// Make the request to the Gemini API
	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
	const data = {
		system_instruction: {
			parts: {
				text: systemPrompt,
			},
		},
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

	let modifiedText;
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();
		modifiedText = result.candidates[0].content.parts[0].text.trim();
		return modifiedText;
	} catch (error) {
		console.error("Error prompting Gemini:", error);
	}
}

const moreProfessional = new CustomMenu(
	"morePro",
	"more professional",
	"make it more professional",
);

chrome.contextMenus.update("sideClickParent", {}, () => {
	customMenus.forEach((menu) => {
		chrome.contextMenus.create({
			id: menu.id,
			// parentId: "sideClickParent",
			title: menu.title,
			contexts: ["selection"],
		});
	});
});
