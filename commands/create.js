import { addPendingMessage } from "../src/pending.js";

export function cmdCreate(_, message) {
	// Ask user to provide a name for the webhook
	addPendingMessage({
		user: message.author.id,
		data: {},
		state: 'enter_name',
	});
	return '### Enter name:\n*Type `cancel` at any point to cancel.*';
}
