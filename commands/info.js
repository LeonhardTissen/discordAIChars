import { registerCommand } from "../src/registrar.js";
import { getModel } from "../src/db.js";
import { channel } from "../src/channel.js";

/**
 * Show various information about a model.
 * @param {string} idName 
 * @returns {string} - The response message
 * @example !info Ben
 */
async function cmdInfo(idName) {
	if (!idName) return '### Please specify a model to show info'

	const row = await getModel(idName);
	
	if (!row) return `### Model with name "${idName}" not found`
	
	const { displayname, owner, model, profile } = row;

	channel.send({
		content: `### Model info for "${displayname}":
		- Owner: ${owner}
		- Prompt: ${model}`,
		files: [profile]
	});
	return;
}

registerCommand('info', cmdInfo, 'Browse', 'Show various information about a model', '[name]');
