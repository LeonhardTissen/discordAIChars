import { Message } from "discord.js";
import { getModel, updateField } from "../db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../permissions.js";
import { channel } from "../channel.js";
import { saveImage } from "../utils/imagesave.js";

/**
 * Change the avatar of a model, if the model is owned by the user
 * @param {string} restOfMessage 
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !avatar Ben
 */
async function cmdAvatar(idName, message) {
	if (!idName) return '### Please specify a model'

	const modelData = await getModel(idName);

	if (!modelData) return `### Model with name "${idName}" not found`

	const { owner, profile } = modelData;

	// New avatar not provided, return current avatar
	if (message.attachments.size === 0) {
		channel.send({
			content: `### Avatar for model "${idName}":`,
			files: [profile]
		});
		return;
	}

	const lowerIdName = idName.toLowerCase();

	// Check if owner
	if (!canModify(message.author.id, owner)) return `### You do not own the model with the name "${idName}"`

	// Get attachment
	const attachment = message.attachments.first();

	// Save avatar to disk
	const avatarPath = await saveImage(attachment.url, lowerIdName, 'avatars');

	// Edit avatar
	try {
		await updateField(idName, 'profile', avatarPath);
		return `### Avatar for model "${idName}" updated`
	} catch (error) {
		return `### Failed to update avatar for model "${idName}": ${error.message}`
	}
}

registerCommand('avatar', cmdAvatar, 'Manage', 'Change the avatar of a model, if the model is owned by the user', '[name] [attachment]');
