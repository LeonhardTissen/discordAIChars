import { db, getModel, updateField } from "../src/db.js";

export async function cmdPrompt(restOfMessage, message) {
	// Example: !prompt Ben
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

	if (row.owner !== message.author.id) return `### You do not own the model with the name "${idName}"`

	try {
		await updateField(idName, 'model', promptString);
		return `### Prompt for model "${idName}" updated`;
	} catch (error) {
		return `### Failed to update prompt for model "${idName}": ${error.message}`;
	}
}
