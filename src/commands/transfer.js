import { Message } from "discord.js";
import { getModel, updateField } from "../db.js";
import { registerCommand } from "../registrar.js";
import { canModify } from "../permissions.js";

/**
 * Transfer ownership of a model to another user.
 * @param {string} arg1: idName - The name of the model
 * @param {string} arg2: newOwner - The user to transfer ownership to
 * @param {string} authorId - The Discord ID of the author
 * @param {Message} message 
 * @returns {string} - The response message
 * @example !transfer Ben <@1234567890>
 */
async function cmdTransfer({ arg1: idName, arg2: newOwner, authorId }) {
	if (!idName || !user) return 'Please specify a model and a user to transfer ownership'

	// Remove non-numeric characters from user
	const newOwnerId = newOwner.replace(/\D/g, '');

	// Check if owner
	const modelData = await getModel(idName);
	
	if (!modelData) return `Model with name "${idName}" not found`
	
	const { owner } = modelData;

	if (!canModify(authorId, owner)) return `You do not own the model with the name "${idName}"`

	// Transfer ownership
	try {
		await updateField(idName, 'owner', newOwnerId);
		return `Ownership of model "${idName}" transferred to <@${newOwnerId}>`
	} catch (error) {
		return `Error transferring ownership of model "${idName}"`
	}
}

registerCommand('transfer', cmdTransfer, 'Manage', 'Transfer ownership of a model to another user', '[name] [user]')
