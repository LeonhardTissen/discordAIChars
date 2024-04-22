import { talkToModel } from "../src/ollama.js";

/**
 * Ask the model a question directly.
 * @param {string} restOfMessage - The message after the command.
 * @example !ask Ben How are you?
 */
export function cmdAsk(restOfMessage) {
	const [idName, ...prompt] = restOfMessage.split(' ');
	const promptString = prompt.join(' ');

	talkToModel(promptString, idName);
}
