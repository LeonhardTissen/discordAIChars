import { db, getModel } from "../src/db.js";

export async function cmdTransfer(restOfMessage, message) {
	// Example: !transfer Ben userid
	let [name, user] = restOfMessage.split(' ');

	if (!name || !user) {
		return '### Please specify a model and a user to transfer ownership'
	}

	// Remove non-numeric characters from user
	user = user.replace(/\D/g, '');

	// Check if owner
	const modelData = await getModel(name);

	const { owner } = modelData;

	if (!modelData) {
		return `### Model with name "${name}" not found`
	}

	if (owner !== message.author.id) {
		return `### You do not own the model with the name "${name}"`
	}

	// Transfer ownership
	await new Promise((resolve, reject) => {
		db.run('UPDATE models SET owner = ? WHERE idname = ?', [user, name], (err) => {
			if (err) {
				reject(err);
				return '### Error transferring ownership';
			}
			resolve();
		});
	});

	return `### Model "${name}" transferred to <@${user}>, they are now the owner`;
}
