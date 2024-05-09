import { registerCommand } from "../registrar.js";
import { displaySettings, resetSettings, updateSetting } from "../settings.js";

/**
 * Display or update model settings.
 * @param {string} arg1: key - The key or "reset"
 * @param {string} arg2: value - The value for the setting 
 * @returns {string} - The response message
 * @example !settings
 * @example !settings reset
 * @example !settings temperature 0.5
 */
async function cmdSettings({ arg1: key, arg2: value }) {
	if (!key) {
		// No changes requested, display settings
		return displaySettings()
	}

	if (value === 'reset') {
		resetSettings();
		return 'Settings reset to default'
	}

	// Update setting may fail if the key or value is invalid, always display the response
	const response = updateSetting(key, value);
	return response
}

registerCommand('settings', cmdSettings, 'Settings', 'Display or update model settings', '[key] [value] | "reset"');
