// import { GoogleGenerativeAI } from './node_modules/@google/generative-ai/dist/index.mjs';

console.log("Hello from the background script!");

class CustomMenu {
	id: string;
	title: string;
	systemPrompt: string;

	constructor(id: string, title: string, prompt: string) {
		this.id = id;
		this.title = title;
		this.systemPrompt = `You are a writing assistant, you are given a text and you have to ${prompt} in the same language as the input and reply with ONLY the fixed text`;
	}
}
const stringTools: {
	id: string;
	title: string;
	systemPrompt: string | undefined;
}[] = [
	{ id: "uppercase", title: "Uppercase", systemPrompt: undefined },
	{ id: "lowercase", title: "Lowercase", systemPrompt: undefined },
	{ id: "capitalize", title: "Capitalize", systemPrompt: undefined },
];

const customMenus: CustomMenu[] = [];

type Tool = {
	title: string;
	systemPrompt: string;
	id: string;
};

const proofread: Tool = {
	title: "Proofread",
	systemPrompt: "fix typos and grammar",
	id: "proofread",
};
const rewrite: Tool = {
	title: "Rewrite",
	systemPrompt: "fix typos and grammar",
	id: "rewrite",
};

const professional: Tool = {
	title: "Professional",
	systemPrompt: "make it more professional",
	id: "pro",
};

const friendly: Tool = {
	title: "Friendly",
	systemPrompt: "make it more friendly",
	id: "friendly",
};

const concise: Tool = {
	title: "Concise",
	systemPrompt: "make it more concise",
	id: "concise",
};

const builtinTools: Tool[] = [
	proofread,
	rewrite,
	professional,
	friendly,
	concise,
];

chrome.runtime.onInstalled.addListener((details) => {
	const request = indexedDB.open("actions");
	let db: IDBDatabase;

	request.onupgradeneeded = () => {
		// The database did not previously exist, so create object stores and indexes.
		const db = request.result;
		const store = db.createObjectStore("actions", { keyPath: "id" });
		console.log(`object store ${store} created`);
		const titleIndex = store.createIndex("by_title", "title", { unique: true });
		const authorIndex = store.createIndex("by_prompt", "prompt");

		// Populate with initial data.
		for (const tool of builtinTools) {
			store.put(tool);
		}
	};
	// for later use in the service worker
	request.onsuccess = () => {
		db = request.result;
	};

	if (details.reason !== "install" && details.reason !== "update") return;
	chrome.contextMenus.create({
		id: "ConTextParent",
		title: "ConText Tools",
		contexts: ["selection"],
	});

	for (const tool of stringTools) {
		chrome.contextMenus.create({
			id: tool.id,
			parentId: "ConTextParent",
			title: tool.title,
			contexts: ["selection"],
		});
	}
	for (const tool of builtinTools) {
		chrome.contextMenus.create({
			id: tool.id,
			parentId: "ConTextParent",
			title: tool.title,
			contexts: ["selection"],
		});
	}

	// const [tab] = await chrome.tabs.query({
	// 		(async () => {
	// 		active: true,
	// 		lastFocusedWindow: true,
	// 	});
	// 	const response = await chrome.tabs.sendMessage(tab.id || 0, {
	// 		getTools: true,
	// 	});
	// 	// do something with response here, not outside the function
	// 	console.log(response);
	// })();
});
// chrome.runtime.onStartup(() => {});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const menuItem =
		stringTools.find((menu) => menu.id === info.menuItemId) ||
		builtinTools.find((menu) => menu.id === info.menuItemId);
	if (menuItem) {
		if (tab && tab.id !== undefined) {
			(async () => {
				const [tab] = await chrome.tabs.query({
					active: true,
					lastFocusedWindow: true,
				});
				const response = await chrome.tabs.sendMessage(tab.id || 0, {
					menuId: menuItem.id,
					menuTitle: menuItem.title,
					menuPrompt: menuItem.systemPrompt,
				});
				// do something with response here, not outside the function
				console.log(response);
			})();
		}
	}
});

// create custom tool
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.id && request.title && request.prompt) {
		chrome.contextMenus.create({
			id: request.id,
			parentId: "ConTextParent",
			title: request.title,
			contexts: ["selection"],
		});
		sendResponse({ status: "success" });
	}
});
chrome.runtime.onConnect.addListener((port) => {
	console.assert(port.name === "tools");
	if (port.name === "tools") {
		port.onMessage.addListener((msg) => {
			if (msg.msg === "getTools") {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				let resp: any;
				console.log(`got ${msg.msg}`);
				const actions: {
					title: string;
					prompt: string;
					id: string | number;
				}[] = [];
				const dbRequest = indexedDB.open("actions");
				dbRequest.onerror = (event) => {
					console.error("Error loading database.");
				};
				dbRequest.onsuccess = (event) => {
					const db = dbRequest.result;
					const objectStore = db.transaction("actions").objectStore("actions");
					objectStore.openCursor().onsuccess = (event) => {
						const cursor = (event.target as IDBRequest).result;
						if (cursor) {
							const { title, prompt, id } = cursor.value;
							actions.push({ title, prompt, id });
							cursor.continue(); // Continue to the next cursor
						} else {
							port.postMessage({ tools: JSON.stringify(actions) });
						}
					};
				};
			}
		});
	}
});
