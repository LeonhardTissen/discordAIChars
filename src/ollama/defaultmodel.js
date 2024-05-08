import { existsJson, loadJson, saveJson } from '../utils/json.js';

const FILE_NAME = 'defaultModel';

export let defaultChannelModel = null;

// Load default model from JSON file on startup
if (existsJson(FILE_NAME)) {
	const parsedData = loadJson(FILE_NAME);
	defaultChannelModel = parsedData.defaultChannelModel;
} else {
	saveDefaultModelToFile();
}

// Function to save default model to JSON file
function saveDefaultModelToFile() {
	saveJson(FILE_NAME, { defaultChannelModel });
}

export function setDefaultChannelModel(model) {
	defaultChannelModel = model;
	saveDefaultModelToFile();
}

export function resetDefaultChannelModel() {
	defaultChannelModel = null;
	saveDefaultModelToFile();
}
