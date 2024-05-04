import { registerCommand } from "../src/registrar.js";
import { getModel } from "../src/db.js";
import { clearAllMessages, clearLastMessagesFrom, clearMessagesFrom } from "../src/ollama/previousmessages.js";

/**
 * Clear chat history for a model
 * @param {string} restOfMessage - The rest of the message after the command
 * @returns {string} - The response message
 * @example !clear Ben
 * @example !clear Ben 5
 */
async function cmdClear(restOfMessage) {
	const [idName, amount] = restOfMessage.split(' ');

	if (idName === 'all') {
		clearAllMessages();
		return '### Chat history for all models cleared';
	}

	if (idName === '') return '### Please specify a model to clear';

	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	const lowerIdName = idName.toLowerCase();

	if (!amount) {
		clearMessagesFrom(lowerIdName);
		return `### Chat history for model "${idName}" cleared`
	}

	const num = parseInt(amount);
	if (isNaN(num)) return '### Please specify a valid number of messages to clear'

	clearLastMessagesFrom(lowerIdName, num);

	return `### Last ${num} messages cleared for model "${idName}"`;
}

registerCommand('clear', cmdClear, 'Interact', 'Clear chat history for a model', '[name | "all"] [amount?]');
