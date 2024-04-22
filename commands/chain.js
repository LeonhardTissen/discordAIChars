import { talkToModel } from "../src/ollama.js";

// TODO: Move to a configurable value
const maximumModelChain = 5;

/**
 * Chain multiple models together, feeding the output of one model to the next.
 * @param {string} restOfMessage - The rest of the message after the command
 * @returns {string} - The response message
 * @example !chain [Ben, Jerry, Ben] Say hello to Jerry
 */
export async function cmdChain(restOfMessage) {
	const firstBracketIndex = restOfMessage.indexOf('[');
	const lastBracketIndex = restOfMessage.lastIndexOf(']');
	const bracketContent = restOfMessage.substring(firstBracketIndex + 1, lastBracketIndex);

	// First prompt is by the user
	let prompt = restOfMessage.substring(lastBracketIndex + 1).trim();

	const modelNames = bracketContent.split(',').map(modelName => modelName.trim());

	if (modelNames.length === 0) return '### No models specified.';

	if (modelNames.length > maximumModelChain) return `### You can only chain up to ${maximumModelChain} models.`;

	for (const modelName of modelNames) {
		prompt = await talkToModel(prompt, modelName);
		if (!prompt) {
			return `### Model ${modelName} failed to respond.`;
		}
	}
}
