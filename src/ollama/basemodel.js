import ollama from 'ollama';

const { BASE_MODEL } = process.env;

export let baseModel = BASE_MODEL;

export function setBaseModel(newModel) {
	baseModel = newModel;
}

export async function getBaseModels() {
	const modelObjects = await ollama.list();
	return modelObjects.models.map(({ name }) => name.replace(':latest', ''));
}
