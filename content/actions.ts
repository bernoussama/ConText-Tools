import { promptGemini } from "./gemini";

export class Action {
	id: string | number;
	title: string;
	modifyText(selectedText: string): Promise<string> | string {
		// Default implementation (if needed)
		return Promise.resolve(selectedText);
	}

	constructor(id: string | number, title: string) {
		this.id = id;
		this.title = title;
	}
}

export class CustomAction extends Action {
	systemPrompt: string;
	constructor(id: string, title: string, systemPrompt: string) {
		super(id, title);
		this.systemPrompt = `You are a writing assistant that do not use markdown, you are given a text and you have to ${systemPrompt} in the same language as the input and reply with ONLY the fixed plain text`;
	}

	override async modifyText(selectedText: string): Promise<string> {
		return promptGemini(this.systemPrompt, selectedText).then(
			(modifiedText) => {
				return modifiedText;
			},
		);
	}
}
