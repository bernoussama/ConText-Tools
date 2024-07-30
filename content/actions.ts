import { promptGemini } from "./gemini";

export class Tool {
	id: string;
	title: string;
	modifyText(selectedText: string): Promise<string> | string {
		// Default implementation (if needed)
		return Promise.resolve(selectedText);
	}

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
	}
}

export class CustomTool extends Tool {
	systemPrompt: string;
	constructor(id: string, title: string, systemPrompt: string) {
		super(id, title);
		this.systemPrompt = `You are a writing assistant that DO NOT USE MARKDOWN, you are given a text and you have to ${systemPrompt} as it is verbatim in the same language as the input and reply with ONLY the fixed plain text`;
	}

	override async modifyText(selectedText: string): Promise<string> {
		return promptGemini(this.systemPrompt, selectedText).then(
			(modifiedText) => {
				return modifiedText;
			},
		);
	}
}
