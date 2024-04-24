import { registerCommand } from "../src/registrar.js";
import { displaySettings, resetSettings, updateSetting } from "../src/settings.js";

/**
 * Display or update model settings.
 * @param {string} restOfMessage 
 * @returns {string} - The response message
 * @example !settings
 * @example !settings reset
 * @example !settings temperature 0.5
 */
async function cmdSettings(restOfMessage) {
	const [key, value] = restOfMessage.split(' ');

	if (!key) {
		// No changes requested, display settings
		return displaySettings()
	}

	if (key === 'reset') {
		resetSettings();
		return '### Settings reset to default'
	}

	// Update setting may fail if the key or value is invalid, always display the response
	const response = updateSetting(key, value);
	return `### ${response}`
}

registerCommand('settings', cmdSettings, 'Settings', 'Display or update model settings', '[key] [value] | reset');
