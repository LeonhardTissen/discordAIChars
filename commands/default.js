import { registerCommand } from "../registrar.js";
import { getModel } from "../src/db.js";
import { resetDefaultChannelModel, setDefaultChannelModel } from "../src/ollama.js";

/**
 * Set a model as the default model for the channel, or clear the default model.
 * @param {string} idName 
 * @returns {string} - The response message
 * @example !default
 * @example !default Ben
 */
async function cmdDefault(idName) {
	if (idName === '') {
		resetDefaultChannelModel();
		return '### Default model cleared'
	}

	const modelData = await getModel(idName);

	if (!modelData) {
		await message.channel.send(`### Model with name "${idName}" not found`);
		return;
	}

	setDefaultChannelModel(idName);
	return `### Default model set to "${idName}"\nThis means you can talk to this model without running the !ask command.`
}

registerCommand('default', cmdDefault, 'Interact', 'Set a model as the default model for the channel, or clear the default model', '[name?]');
