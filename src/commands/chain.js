import { registerCommand } from "../registrar.js";
import { talkToModel } from "../ollama/chat.js";

const maximumModelChain = process.env.MAXIMUM_MODEL_CHAIN || 5;

/**
 * Chain multiple models together, feeding the output of one model to the next.
 * @param {string} restOfMessage - The rest of the message after the command
 * @param {Message} message - The Discord message
 * @returns {string} - The response message
 * @example !chain [Ben, Jerry, Ben] Say hello to Jerry
 */
async function cmdChain({ restOfMessage, message }) {
	const firstBracketIndex = restOfMessage.indexOf('[');
	const lastBracketIndex = restOfMessage.indexOf(']');
	const bracketContent = restOfMessage.substring(firstBracketIndex + 1, lastBracketIndex);

	const modelNames = bracketContent.split(',').map(modelName => modelName.trim());

	if (modelNames.length === 0) return 'No models specified.';

	if (modelNames.length > maximumModelChain) return `You can only chain up to ${maximumModelChain} models.`;

	// First prompt is by the user
	let prompt = restOfMessage.substring(lastBracketIndex + 1).trim();

	for (const modelName of modelNames) {
		// Change prompt to the one from the previous model
		prompt = await talkToModel(prompt, message, modelName);

		if (!prompt) return;
	}
}

registerCommand('chain', cmdChain, 'Interact', 'Chain multiple models together, feeding the output of one model to the next', '[model1, model2, ...] [prompt]');
