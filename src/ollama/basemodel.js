import ollama from 'ollama';

const { BASE_MODEL } = process.env;

export let baseModel = BASE_MODEL;

export function setBaseModel(newModel) {
	baseModel = newModel;
}

export async function getBaseModels() {
	const modelObjects = await ollama.list();
	const modelNames = modelObjects.models.map(modelObject => {
		const modelName = modelObject.name
		if (modelName.endsWith(':latest')) {
			return modelName.replace(':latest', '');
		}
		return modelName;
	});
	return modelNames;
}
