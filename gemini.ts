export let promptGemini = async (
	systemPrompt: string,
	selectedText: string,
) => {
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
};
