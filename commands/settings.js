import { displaySettings, resetSettings, updateSetting } from "../src/settings.js";

export async function cmdSettings(restOfMessage) {
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
