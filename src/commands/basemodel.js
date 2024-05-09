import { baseModel, imageRecognitionModel, getBaseModels, setBaseModel } from "../ollama/basemodel.js";
import { isAdmin } from "../permissions.js";
import { registerCommand } from "../registrar.js";

/**
 * Returns the base model
 * @param {string} arg1: idName - The name of the model or "list"
 * @param {string} authorId - The Discord ID of the author
 * @returns {string} - The response message containing the base model
 * @example !basemodel
 */
async function cmdBasemodel({ arg1: idName, authorId }) {
	if (!idName) return `Active models:
	Chat model: [${baseModel}](<https://ollama.com/library/${baseModel}>)
	Image recognition model: [${imageRecognitionModel}](<https://ollama.com/library/${imageRecognitionModel}>)`

	if (!isAdmin(authorId)) return 'You do not have permission to use this command'

	const baseModels = await getBaseModels();

	const baseModelLinks = baseModels.map(model => `[${model}](<https://ollama.com/library/${model}>)`);

	if (idName === 'list') return `Available base models:\n${baseModelLinks.join('\n')}`

	if (!baseModels.includes(idName)) return `Model with name "${idName}" not found`

	setBaseModel(idName);
	return `Base model has been set to: [${baseModel}](https://ollama.com/library/${baseModel})`
}

registerCommand('basemodel', cmdBasemodel, 'Other', 'View or modify the current basemodel', '[model? | "list"?]');
