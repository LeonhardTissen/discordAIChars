import { registerCommand } from "../registrar.js";
import { getModel } from "../src/db.js";

/**
 * Show various information about a model.
 * @param {string} idName 
 * @returns {string} - The response message
 * @example !info Ben
 */
async function cmdInfo(idName) {
	if (!idName) return '### Please specify a model to show info'

	const row = await getModel(idName);

	const { displayname, owner, model, profile } = row;

	if (!row) return `### Model with name "${idName}" not found`

	return `### Model info for "${displayname}":
- Avatar: ${profile}
- Owner: ${owner}
- Prompt: ${model}`
}

registerCommand('info', cmdInfo, 'Browse', 'Show various information about a model', '[name]');
