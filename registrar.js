export const commands = [];

export const categoryNames = {
	Other: 'Other commands',
	Manage: 'Commands for managing models',
	Browse: 'Commands for browsing models',
	Interact: 'Commands for interacting with models',
	Settings: 'Commands for changing global settings',
	Debug: 'Commands for debugging',
}

/**
 * Register a command, used by every command on startup
 * @param {string} command 
 * @param {*} callback
 * @param {string} category 
 * @param {string} description 
 * @param {string} parameters
 */
export function registerCommand(command, callback, category, description = '', parameters = '') {
	commands.push({ command, callback, category, description, parameters });
}

/**
 * Get a callback by command
 * @param {string} command
 * @returns {*} - The callback function
 */
export function getCallbackByCommand(command) {
	const found = commands.find(c => c.command === command);
	if (!found) return null;
	return found.callback;
}
