import { Message } from "discord.js";
import { getModel, updateField } from "../src/db.js";

/**
 * Change the avatar of a model, if the model is owned by the user
 * @param {string} restOfMessage 
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !avatar Ben https://example.com/avatar.png
 */
export async function cmdAvatar(restOfMessage, message) {
	const [idName, avatar] = restOfMessage.split(' ');

	if (!idName || !avatar) return '### Please specify a model and an avatar URL'

	// Check if owner
	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	const { owner } = modelData;

	if (owner !== message.author.id) return `### You do not own the model with the name "${idName}"`

	// Edit avatar
	try {
		await updateField(idName, 'profile', avatar);
		return `### Avatar for model "${idName}" updated`
	} catch (error) {
		return `### Failed to update avatar for model "${idName}": ${error.message}`
	}
}
