import { registerCommand } from "../src/registrar.js";
import { talkToModel } from "../src/ollama/chat.js";
import { isForceStopped } from "../src/ollama/forcestop.js";

const maximumModelChain = process.env.MAXIMUM_MODEL_CHAIN || 5;

/**
 * Chain multiple models together, feeding the output of one model to the next.
 * @param {string} restOfMessage - The rest of the message after the command
 * @returns {string} - The response message
 * @example !chain [Ben, Jerry, Ben] Say hello to Jerry
 */
async function cmdChain(restOfMessage) {
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

		if (isForceStopped) return '### Chain stopped.';

		if (!prompt) return `### Model ${modelName} failed to respond.`;
	}
}

registerCommand('chain', cmdChain, 'Interact', 'Chain multiple models together, feeding the output of one model to the next', '[model1, model2, ...] [prompt]');
