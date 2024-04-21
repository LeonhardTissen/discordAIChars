import { db } from "../src/db.js";

export async function cmdAvatar(restOfMessage, message) {
	const [modelName, avatar] = restOfMessage.split(' ');

	if (!modelName || !avatar) return '### Please specify a model and an avatar URL'

	// Check if owner
	const modelData = await new Promise((resolve, reject) => {
		db.get('SELECT owner FROM models WHERE idname = ?', [modelName], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	if (!modelData) return `### Model with name "${modelName}" not found`

	const { owner } = modelData;

	if (owner !== message.author.id) return `### You do not own the model with the name "${modelName}"`

	// Edit avatar
	db.run('UPDATE models SET profile = ? WHERE idname = ?', [avatar, modelName], async (err) => {
		if (err) {
			console.error(err);
			return;
		}

	});
	
	return `### Avatar for model "${modelName}" updated`
}
