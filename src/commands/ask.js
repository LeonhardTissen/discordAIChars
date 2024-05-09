import { registerCommand } from "../registrar.js";
import { talkToModel } from "../ollama/chat.js";

/**
 * Ask the model a question directly.
 * @param {string} arg1: idName - The name of the model or "random"
 * @param {string} messageAfterArg1: promptString - The prompt for the model to answer
 * @param {Message} message - The Discord message
 * @returns {string} - The response to the command.
 * @example !ask Ben How are you?
 * 
 */
function cmdAsk({ arg1: idName, messageAfterArg1: promptString, message }) {
	if (!idName) return '### Please provide a name for the model.';

	if (!promptString) return '### Please provide a prompt for the model to answer.';

	talkToModel(promptString, message, idName);
}

registerCommand('ask', cmdAsk, 'Interact', 'Ask the model a question directly', '[name | "random"] [prompt | "last"]');
