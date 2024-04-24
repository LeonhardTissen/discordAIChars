import { Message } from "discord.js";
import { getAllModels } from "../src/db.js";
import { registerCommand } from "../src/registrar.js";

/**
 * Show a list of all available models, separated by whether the user owns them or not.
 * @param {*} _ 
 * @param {Message} message
 * @returns {string} - The response message
 * @example !list
 */
async function cmdList(_, message) {
	const modelDataArr = await getAllModels();

	if (!modelDataArr.length) return '### No models found';

	const yourModels = [];
	const otherModels = [];

	for (const { idname, owner } of modelDataArr) {
		if (owner === message.author.id) {
			yourModels.push(idname);
		} else {
			otherModels.push(idname);
		}
	}

	return `### Your Models:\n${yourModels.join(', ')}\n### Other Models:\n${otherModels.join(', ')}`;
}

registerCommand('list', cmdList, 'Browse', 'Show a list of all available models, separated by whether the user owns them or not');
