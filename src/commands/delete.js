import { deleteModel, getModel } from "../db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../permissions.js";

/**
 * Delete a model, if the model is owned by the user
 * @param {string} arg1: idName - The name of the model 
 * @param {string} authorId - The Discord ID of the author
 * @returns {string} - The response message
 * @example !delete Ben
 */
async function cmdDelete({ arg1: idName, authorId }) {
	if (idName === '') return '### Please specify a model to delete'

	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	const { owner } = modelData;

	if (!canModify(authorId, owner)) return `### You do not own the model with the name "${idName}"`

	await deleteModel(idName);

	return `### Model with name "${idName}" deleted`
}

registerCommand('delete', cmdDelete, 'Manage', 'Delete a model, if the model is owned by the user', '[name]');
