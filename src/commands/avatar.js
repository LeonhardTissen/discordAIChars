import { getModel, updateField } from "../db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../permissions.js";
import { saveImage } from "../utils/imagesave.js";

/**
 * Change the avatar of a model, if the model is owned by the user
 * @param {string} arg1: idName - The name of the model
 * @param {string} authorId - The Discord ID of the author
 * @param {Object[]} attachments - The attachments of the message
 * @returns {string[]} - The response message and path to the model's profile
 * @example !avatar Ben
 */
async function cmdAvatar({ arg1: idName, authorId, attachments }) {
	if (!idName) return 'Please specify a model'

	const modelData = await getModel(idName);

	if (!modelData) return `Model with name "${idName}" not found`

	const { owner, profile } = modelData;

	// New avatar not provided, return current avatar
	if (attachments.size === 0) return [`Avatar for model "${idName}":`, profile];

	const lowerIdName = idName.toLowerCase();

	// Check if owner
	if (!canModify(authorId, owner)) return `You do not own the model with the name "${idName}"`

	// Get attachment
	const attachment = attachments.first();

	// Save avatar to disk
	const avatarPath = await saveImage(attachment.url, lowerIdName, 'avatars');

	// Edit avatar
	try {
		await updateField(idName, 'profile', avatarPath);
		return `Avatar for model "${idName}" updated`
	} catch (error) {
		return `Failed to update avatar for model "${idName}": ${error.message}`
	}
}

registerCommand('avatar', cmdAvatar, 'Manage', 'Change the avatar of a model, if the model is owned by the user', '[name] [attachment]');
