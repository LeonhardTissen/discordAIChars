import { db } from "../src/db.js";

export async function cmdDelete(restOfMessage, message) {
	// Example: !delete Ben
	const modelName = restOfMessage;

	if (modelName === '') return '### Please specify a model to delete'

	// Find webhook by name
	const modelData = await new Promise((resolve, reject) => {
		db.get('SELECT idname, owner FROM models WHERE idname = ?', [modelName], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	if (!modelData) return `### Model with name "${modelName}" not found`

	const { idname, owner } = modelData;

	if (owner !== message.author.id) return `### You do not own the model with the name "${modelName}"`

	// Delete model from database
	db.run('DELETE FROM models WHERE idname = ?', [idname]);

	return `### Model with name "${modelName}" deleted`
}
