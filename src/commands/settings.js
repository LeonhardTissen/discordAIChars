import { registerCommand } from "../registrar.js";
import { displaySettings, resetSettings, updateSetting } from "../settings.js";

/**
 * Display or update model settings.
 * @param {string} arg1 - The key or "reset"
 * @param {string} arg2 - The value for the setting 
 * @returns {string} - The response message
 * @example !settings
 * @example !settings reset
 * @example !settings temperature 0.5
 */
async function cmdSettings({ arg1, arg2 }) {
	if (!arg1) {
		// No changes requested, display settings
		return displaySettings()
	}

	if (arg1 === 'reset') {
		resetSettings();
		return '### Settings reset to default'
	}

	// Update setting may fail if the key or value is invalid, always display the response
	const response = updateSetting(arg1, arg2);
	return `### ${response}`
}

registerCommand('settings', cmdSettings, 'Settings', 'Display or update model settings', '[key] [value] | "reset"');
