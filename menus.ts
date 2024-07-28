export class CustomMenu {
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
