import { registerCommand } from "../registrar.js";
import { getModel } from "../db.js";
import { clearAllMessages, clearLastMessagesFrom, clearMessagesFrom } from "../ollama/previousmessages.js";

/**
 * Clear chat history for a model
 * @param {string} arg1: idName - The name of the model or "all"
 * @param {string} arg2: amount - The number of messages to clear
 * @returns {string} - The response message
 * @example !clear Ben
 * @example !clear Ben 5
 */
async function cmdClear({ arg1: idName, arg2: amount }) {
	if (idName === 'all') {
		clearAllMessages();
		return 'Chat history for all models cleared';
	}

	if (idName === '') return 'Please specify a model to clear';

	const modelData = await getModel(idName);

	if (!modelData) return `Model with name "${idName}" not found`

	const lowerIdName = idName.toLowerCase();

	if (!amount) {
		clearMessagesFrom(lowerIdName);
		return `Chat history for model "${idName}" cleared`
	}

	const num = parseInt(amount);
	if (isNaN(num)) return 'Please specify a valid number of messages to clear'

	clearLastMessagesFrom(lowerIdName, num);

	return `Last ${num} messages cleared for model "${idName}"`;
}

registerCommand('clear', cmdClear, 'Interact', 'Clear chat history for a model', '[name | "all"] [amount?]');
