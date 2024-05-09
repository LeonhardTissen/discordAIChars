import { addPendingMessage } from "../pending.js";
import { registerCommand } from "../registrar.js";

/**
 * Start the process of creating a new model. The user will be asked for a name, avatar and prompt.
 * @param {string} authorId - The ID of the user
 * @returns {string} - The response message
 * @example !create
 */
function cmdCreate({ authorId }) {
	addPendingMessage({
		user: authorId,
		data: {},
		state: 'enter_name',
	});
	return 'Enter name:\n*Type `cancel` at any point to cancel.*';
}

registerCommand('create', cmdCreate, 'Manage', 'Start the process of creating a new model. The user will be asked for a name, avatar and prompt');
