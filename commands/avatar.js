import { Message } from "discord.js";
import { getModel, updateField } from "../src/db.js";
import { registerCommand } from "../src/registrar.js";
import { canModify } from "../src/permissions.js";
import { isValidImageUrl } from "../src/url.js";

/**
 * Change the avatar of a model, if the model is owned by the user
 * @param {string} restOfMessage 
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !avatar Ben https://example.com/avatar.png
 */
async function cmdAvatar(restOfMessage, message) {
	const [idName, avatar] = restOfMessage.split(' ');

	if (!idName) return '### Please specify a model'

	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	// New avatar not provided, return current avatar
	if (!avatar) return `### Avatar for model "${idName}": \n${modelData.profile}`

	// Check if owner
	const { owner } = modelData;

	// Check if valid URL
	if (!isValidImageUrl(avatar)) return '### Invalid URL, please provide a valid URL'

	if (!canModify(message.author.id, owner)) return `### You do not own the model with the name "${idName}"`

	// Edit avatar
	try {
		await updateField(idName, 'profile', avatar);
		return `### Avatar for model "${idName}" updated`
	} catch (error) {
		return `### Failed to update avatar for model "${idName}": ${error.message}`
	}
}

registerCommand('avatar', cmdAvatar, 'Manage', 'Change the avatar of a model, if the model is owned by the user', '[name] [avatar]');
