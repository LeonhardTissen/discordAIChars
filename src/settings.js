import { format } from "./formatter.js";
import fs from 'fs';

const defaultSettings = {
	temperature: 0.8,
	num_predict: 512,
	num_ctx: 2048,
	// microstat: 1,
	// microstat_eta: 0.1,
	// microstat_tau: 5,
	top_p: 0.9,
	top_k: 40,
	repeat_penalty: 1.1,
	simultaneous_messages: false,
}

const settingDataTypes = {
	temperature: 'float',
	num_predict: 'int',
	num_ctx: 'int',
	// microstat: 'int',
	// microstat_eta: 'float',
	// microstat_tau: 'float',
	top_p: 'float',
	top_k: 'int',
	repeat_penalty: 'float',
	simultaneous_messages: 'bool',
}

const settingBounds = {
	temperature: [0, 1],
	num_predict: [1, 2000],
	num_ctx: [1, 50000],
	// microstat: [0, 2],
	// microstat_eta: [0, 5],
	// microstat_tau: [0, 10],
	top_p: [0, 1],
	top_k: [1, 500],
	repeat_penalty: [0, 50],
}

const settingDescriptions = {
	temperature: 'The temperature of the model. Higher = Creative',
	num_predict: 'Maximum number of tokens to predict when generating text',
	num_ctx: 'Sets the size of the context window used to generate the next token.',
	// microstat: 'Enable Mirostat sampling for controlling perplexity',
	// microstat_eta: 'Influences how quickly the algorithm responds to feedback from the generated text. Higher = More responsive to change',
	// microstat_tau: 'Controls the balance between coherence and diversity of the output. Lower = Focused',
	top_k: 'Reduces the probability of generating nonsense. Higher = Diverse, Lower = Conservative',
	top_p: 'Works together with top-k. Higher = Diverse, Lower = Conservative',
	repeat_penalty: 'Sets how strongly to penalize repetitions',
	simultaneous_messages: 'Whether to allow multiple messages to be sent at once',
}

function copyDefaultSettings() {
	return JSON.parse(JSON.stringify(defaultSettings));
}

const settingsFilePath = 'settings.json';

// Load settings from settings.json if it exists
export let settings = copyDefaultSettings();
if (fs.existsSync(settingsFilePath)) {
	const loadedSettings = JSON.parse(fs.readFileSync(settingsFilePath));
	settings = { ...defaultSettings, ...loadedSettings };
}

export function updateSetting(key, inputString) {
	if (!settingDataTypes[key]) {
		return `Invalid setting: ${key}`;
	}
	let value = inputString;
	if (settingDataTypes[key] === 'float') {
		value = parseFloat(inputString);
		if (isNaN(value)) {
			return `Invalid value for ${key}. Must be a float`;
		}
	} else if (settingDataTypes[key] === 'int') {
		value = parseInt(inputString);
		if (isNaN(value)) {
			return `Invalid value for ${key}. Must be an integer`;
		}
	} else if (settingDataTypes[key] === 'bool') {
		value = inputString.toLowerCase();
		if (value === 'true') {
			value = true;
		} else if (value === 'false') {
			value = false;
		} else {
			return `Invalid value for ${key}. Must be true or false`;
		}
	}
	if (settingBounds[key]) {
		const [min, max] = settingBounds[key];
		if (value < min || value > max) {
			return `Value for ${key} must be between ${min} and ${max}`;
		} 
	}
	settings[key] = value;
	fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
	return `Updated ${key} to ${value}`;
}

export function resetSettings() {
	settings = copyDefaultSettings();
	fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
}

export function displaySettings() {
	let displayString = '$tSettings:\n\n';
	for (const key in settings) {
		let boundsText = '';
		if (settingBounds[key]) {
			const [min, max] = settingBounds[key];
			boundsText = `$x[${min}-${max}] `;
		}
		const dataType = `$b${settingDataTypes[key]} `;
		const defaultValue = `$rDef: ${defaultSettings[key]} `;
		const settingDescription = `$p${settingDescriptions[key]}\n`;
		displayString += `${settingDescription}$y${key}$x: $w${settings[key]} ${boundsText}${defaultValue}${dataType}\n\n`;
	}
	return format(displayString);
}

export function getParameters() {
	return {
		temperature: settings.temperature,
		num_predict: settings.num_predict,
		num_ctx: settings.num_ctx,
		top_p: settings.top_p,
		top_k: settings.top_k,
		repeat_penalty: settings.repeat_penalty,
	}
}
