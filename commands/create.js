import { Message } from "discord.js";
import { addPendingMessage } from "../src/pending.js";

/**
 * Start the process of creating a new model. The user will be asked for a name, avatar and prompt.
 * @param {*} _ 
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !create
 */
export function cmdCreate(_, message) {
	addPendingMessage({
		user: message.author.id,
		data: {},
		state: 'enter_name',
	});
	return '### Enter name:\n*Type `cancel` at any point to cancel.*';
}
