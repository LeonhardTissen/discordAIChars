import { baseModel, imageRecognitionModel, getBaseModels, setBaseModel } from "../ollama/basemodel.js";
import { isAdmin } from "../permissions.js";
import { registerCommand } from "../registrar.js";

/**
 * Returns the base model
 * @param {string} query - The new model to set as the base model, or "list"
 * @returns {string} - The response message containing the base model
 * @example !basemodel
 */
async function cmdBasemodel(query, message) {
	if (!query) return `### Base model: [${baseModel}](https://ollama.com/library/${baseModel})
		
		### Image recognition model: [${imageRecognitionModel}](https://ollama.com/library/${imageRecognitionModel})`

	if (!isAdmin(message.author.id)) return '### You do not have permission to use this command'

	const baseModelList = await getBaseModels();

	if (query === 'list') return `### Base models:\n${baseModelList.join('\n')}`

	const newModel = query.trim();

	if (!baseModelList.includes(newModel)) return `### Model with name "${newModel}" not found`

	setBaseModel(newModel);
	return `### Base model has been set to: [${baseModel}](https://ollama.com/library/${baseModel})`
}

registerCommand('basemodel', cmdBasemodel, 'Other', 'View or modify the current basemodel', '[model? | "list"?]');
