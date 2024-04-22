import { talkToModel } from "../src/ollama.js";

const maximumModelChain = 5;

export async function cmdChain(restOfMessage) {
	// Example: !chain [modelA, modelB] What is the capital of France?

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
