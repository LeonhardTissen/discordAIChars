import { db } from "../src/db.js";
import { previousMessages } from "../src/ollama.js";

export async function cmdClear(restOfMessage) {
	const [idName, amount] = restOfMessage.split(' ');

	if (idName === '') {
		return '### Please specify a model to clear';
	}

	const modelData = await new Promise((resolve, reject) => {
		db.get('SELECT idname FROM models WHERE idname = ?', [idName], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		})
	});

	if (!modelData) {
		return `### Model with name "${idName}" not found`
	}

	if (!amount) {
		previousMessages[idName] = [];
		return `### Chat history for model "${idName}" cleared`
	}

	const num = parseInt(amount);
	if (isNaN(num)) {
		return '### Please specify a valid number of messages to clear'
	}

	previousMessages[idName] = previousMessages[idName].slice(0, -num * 2);
	return `### Last ${num} messages cleared for model "${idName}"`;
}
