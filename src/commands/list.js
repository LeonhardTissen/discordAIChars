import { getAllModels } from "../db.js";
import { registerCommand } from "../registrar.js";

/**
 * Show a list of all available models, separated by whether the user owns them or not.
 * @param {String} authorId - The Discord user ID
 * @returns {string} - The response message
 * @example !list
 */
async function cmdList({ authorId }) {
	const modelDataArr = await getAllModels();

	if (!modelDataArr.length) return '### No models found';

	const yourModels = [];
	const otherModels = [];

	for (const { idname, owner } of modelDataArr) {
		if (owner === authorId) {
			yourModels.push(idname);
		} else {
			otherModels.push(idname);
		}
	}

	return `### Your Models:\n${yourModels.join(', ')}\n### Other Models:\n${otherModels.join(', ')}`;
}

registerCommand('list', cmdList, 'Browse', 'Show a list of all available models, separated by whether the user owns them or not');
