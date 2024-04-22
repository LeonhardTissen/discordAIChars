import { talkToModel } from "../src/ollama.js";

export function cmdAsk(restOfMessage) {
	// Example: !ask Ben What is the capital of France?
	const [idName, ...prompt] = restOfMessage.split(' ');
	const promptString = prompt.join(' ');

	talkToModel(promptString, idName);
}
