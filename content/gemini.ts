import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

export async function promptGemini(
	systemPrompt: string,
	userPrompt: string,
): Promise<string> {
	console.log("prompting gemini");
	console.log(`system prompt: ${systemPrompt}`);
	return new Promise((resolve) => {
		chrome.storage.local.get("apiKey", async (result) => {
			let apiKey: string = result.apiKey;
			if (!apiKey) {
				console.error("API key is not set");
				resolve(""); // Return empty string if no API key
				return;
				// apiKey = "AIzaSyBRtKqYoFeK23QwpYjDaRgZ_lH7Mlnu4Ro";
			}
			const safetySettings = [
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
			];

			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({
				model: "gemini-1.5-flash",
				safetySettings,
				systemInstruction: systemPrompt,
			});

			const res = await model.generateContent(userPrompt);
			const response = await res.response;
			console.log(response);
			const text = response.text();
			console.log(`gemini response: ${text}`);
			resolve(text.trim()); // Resolve with the generated text
		});
	});
}
