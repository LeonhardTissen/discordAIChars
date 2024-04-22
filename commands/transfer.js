import { Message } from "discord.js";
import { getModel, updateField } from "../src/db.js";

/**
 * Transfer ownership of a model to another user.
 * @param {string} restOfMessage 
 * @param {Message} message 
 * @returns {string} - The response message\
 * @example !transfer Ben <@1234567890>
 */
export async function cmdTransfer(restOfMessage, message) {
	let [idName, user] = restOfMessage.split(' ');

	if (!idName || !user) return '### Please specify a model and a user to transfer ownership'

	// Remove non-numeric characters from user
	user = user.replace(/\D/g, '');

	// Check if owner
	const modelData = await getModel(idName);

	const { owner } = modelData;

	if (!modelData) return `### Model with name "${idName}" not found`

	if (owner !== message.author.id) return `### You do not own the model with the name "${idName}"`

	// Transfer ownership
	try {
		await updateField(idName, 'owner', user);
		return `### Ownership of model "${idName}" transferred to <@${user}>`
	} catch (error) {
		return `### Error transferring ownership of model "${idName}"`
	}
}
