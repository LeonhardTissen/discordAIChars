import { getModel, updateField } from "../db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../permissions.js";

/**
 * Show or edit the prompt for a model
 * @param {string} arg1: idName - The name of the model
 * @param {string} messageAfterArg1: prompt - The prompt
 * @param {string} authorId - The Discord ID of the author
 * @returns {string} - The response message
 * @example !prompt Ben
 * @example !prompt Ben You are ben, a detective in a small town...
 */
async function cmdPrompt({ arg1: idName, messageAfterArg1: prompt, authorId }) {
	if (!idName) return '### Please specify a model to show or edit the prompt'

	if (!prompt) {
		const modelData = await getModel(idName);

		if (!modelData) return `### Model with name "${idName}" not found`

		return `### Prompt for model "${idName}":\n${modelData.model}`
	}

	// Check if owner
	const row = await getModel(idName);

	if (!row) return `### Model with name "${idName}" not found`

	const { owner } = row;

	if (!canModify(authorId, owner)) return `### You do not own the model with the name "${idName}"`

	try {
		await updateField(idName, 'model', prompt);
		return `### Prompt for model "${idName}" updated`;
	} catch (error) {
		return `### Failed to update prompt for model "${idName}": ${error.message}`;
	}
}

registerCommand('prompt', cmdPrompt, 'Manage', 'Show or edit the prompt for a model', '[name] [prompt]');
