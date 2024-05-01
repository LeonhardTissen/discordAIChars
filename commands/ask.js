import { registerCommand } from "../src/registrar.js";
import { talkToModel } from "../src/ollama.js";

/**
 * Ask the model a question directly.
 * @param {string} restOfMessage - The message after the command.
 * @returns {string} - The response to the command.
 * @example !ask Ben How are you?
 * 
 */
function cmdAsk(restOfMessage) {
	const [idName, ...prompt] = restOfMessage.split(' ');
	const promptString = prompt.join(' ');

	if (!idName) return '### Please provide a name for the model.';

	if (!promptString) return '### Please provide a prompt for the model to answer.';

	talkToModel(promptString, idName);
}

registerCommand('ask', cmdAsk, 'Interact', 'Ask the model a question directly', '[name] [prompt]');
