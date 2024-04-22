import { registerCommand } from "../registrar.js";
import { getModel } from "../src/db.js";
import { previousMessages } from "../src/ollama.js";

/**
 * Clear chat history for a model
 * @param {string} restOfMessage - The rest of the message after the command
 * @returns {string} - The response message
 * @example !clear Ben
 * @example !clear Ben 5
 */
async function cmdClear(restOfMessage) {
	const [idName, amount] = restOfMessage.split(' ');

	if (idName === '') return '### Please specify a model to clear';

	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	if (!amount) {
		previousMessages[idName] = [];
		return `### Chat history for model "${idName}" cleared`
	}

	const num = parseInt(amount);
	if (isNaN(num)) return '### Please specify a valid number of messages to clear'

	// Remove last message pair times the number specified
	previousMessages[idName] = previousMessages[idName].slice(0, -num * 2);

	return `### Last ${num} messages cleared for model "${idName}"`;
}

registerCommand('clear', cmdClear, 'Interact', 'Clear chat history for a model', '[name] [amount?]');
