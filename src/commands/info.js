import { registerCommand } from "../registrar.js";
import { getModel, getRandomModel } from "../db.js";

/**
 * Show various information about a model.
 * @param {string} arg1: idName - The name of the model or "random"
 * @returns {string[]} - The response message and path to the model's profile
 * @example !info Ben
 */
async function cmdInfo({ arg1: idName }) {
	if (!idName) return 'Please specify a model to show info'

	const isRandom = idName.toLowerCase() === 'random';

	const modelData = isRandom ? await getRandomModel() : await getModel(idName);
	
	if (!modelData) return `Model with name "${idName}" not found`
	
	const { displayname, owner, model, profile } = modelData;

	return [`Model info for "${displayname}":
	- Owner: ${owner}
	- Prompt: ${model}`, profile];
}

registerCommand('info', cmdInfo, 'Browse', 'Show various information about a model', '[name | "random"]');
