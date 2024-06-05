import ollama from 'ollama';

const { BASE_MODEL, IMAGE_RECOGNITION_MODEL } = process.env;

export let baseModel = BASE_MODEL || 'dolphin-llama3'

export function setBaseModel(newModel) {
	baseModel = newModel;
}

export let imageRecognitionModel = IMAGE_RECOGNITION_MODEL || 'llava-llama3:8b-v1.1-q4_0';

export function setImageRecognitionModel(newModel) {
	imageRecognitionModel = newModel;
}

export async function getBaseModels() {
	const modelObjects = await ollama.list();
	return modelObjects.models.map(({ name }) => name.replace(':latest', ''));
}
