import { deleteModel, getModel } from "../src/db.js";

export async function cmdDelete(restOfMessage, message) {
	// Example: !delete Ben
	const idName = restOfMessage;

	if (idName === '') return '### Please specify a model to delete'

	// Find webhook by name
	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	const { idname, owner } = modelData;

	if (owner !== message.author.id) return `### You do not own the model with the name "${idName}"`

	// Delete model from database
	await deleteModel(idName);

	return `### Model with name "${idName}" deleted`
}
