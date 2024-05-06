import fs from 'fs';
import { FgRed } from '../consolecolors.js';

const FILE_PATH = 'defaultModel.json';

export let defaultChannelModel = null;

// Load default model from JSON file on startup
try {
	const data = fs.readFileSync(FILE_PATH, 'utf8');
	const parsedData = JSON.parse(data);
	defaultChannelModel = parsedData.defaultChannelModel;
} catch (err) {
	if (err.code === 'ENOENT') {
		// If the file does not exist, create an empty object
		fs.writeFileSync(FILE_PATH, JSON.stringify({ defaultChannelModel }), 'utf8');
	} else {
		console.error(`${FgRed}Error loading default channel model: ${err}`);
	}
}

// Function to save default model to JSON file
function saveDefaultModelToFile() {
	const data = { defaultChannelModel };
	fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), err => {
		if (err) {
			console.error(`${FgRed}Error saving default channel model: ${err}`);
		}
	});
}

export function setDefaultChannelModel(model) {
	defaultChannelModel = model;
	saveDefaultModelToFile();
}

export function resetDefaultChannelModel() {
	defaultChannelModel = null;
	saveDefaultModelToFile();
}
