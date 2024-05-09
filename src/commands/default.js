import { registerCommand } from "../registrar.js";
import { getApplicableModel } from "../db.js";
import { resetDefaultChannelModel, setDefaultChannelModel } from "../ollama/defaultmodel.js";

/**
 * Set a model as the default model for the channel, or clear the default model.
 * @param {string} arg1: idName - The name of the model or "random"
 * @returns {string} - The response message
 * @example !default
 * @example !default Ben
 */
async function cmdDefault({ arg1: idName }) {
	if (idName === '') {
		resetDefaultChannelModel();
		return 'Default model cleared'
	}

	const modelData = getApplicableModel(idName)

	if (!modelData) return `Model with name "${idName}" not found`

	const { displayname } = modelData;

	setDefaultChannelModel(idName);
	return `Default model set to "${displayname}"\nThis means you can talk to this model without running the !ask command.`
}

registerCommand('default', cmdDefault, 'Interact', 'Set a model as the default model for the channel, or clear the default model', '[name?]');
