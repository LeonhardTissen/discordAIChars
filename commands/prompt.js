import { Message } from "discord.js";
import { getModel, updateField } from "../src/db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../src/permissions.js";

/**
 * Show or edit the prompt for a model
 * @param {string} restOfMessage - The message after the command.
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !prompt Ben
 * @example !prompt Ben You are ben, a detective in a small town...
 */
async function cmdPrompt(restOfMessage, message) {
	const [idName, ...prompt] = restOfMessage.split(' ');

	if (!idName) return '### Please specify a model to show or edit the prompt'

	const promptString = prompt.join(' ');
	if (!promptString) {
		const modelData = await getModel(idName);

		if (!modelData) return `### Model with name "${idName}" not found`

		return `### Prompt for model "${idName}":\n${modelData.model}`
	}

	// Check if owner
	const row = await getModel(idName);

	if (!row) return `### Model with name "${idName}" not found`

	const { owner } = row;

	if (!canModify(message.author.id, owner)) return `### You do not own the model with the name "${idName}"`

	try {
		await updateField(idName, 'model', promptString);
		return `### Prompt for model "${idName}" updated`;
	} catch (error) {
		return `### Failed to update prompt for model "${idName}": ${error.message}`;
	}
}

registerCommand('prompt', cmdPrompt, 'Manage', 'Show or edit the prompt for a model', '[name] [prompt]');
