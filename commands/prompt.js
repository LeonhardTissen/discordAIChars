import { db, getModel } from "../src/db.js";


export async function cmdPrompt(restOfMessage, message) {
	// Example: !prompt Ben
	const [idName, ...prompt] = restOfMessage.split(' ');

	if (!idName) return '### Please specify a model to show or edit the prompt'

	const promptString = prompt.join(' ');
	if (!promptString) {
		const response = await new Promise((resolve, _) => {
			db.get('SELECT model FROM models WHERE idname = ?', [idName], async (err, row) => {
				if (err) {
					resolve(`### Error fetching prompt for model "${idName}"`)
				}

				if (row === undefined) {
					resolve(`### Model with name "${idName}" not found`)
					return;
				}

				resolve(`### Prompt for model "${idName}":\n${row.model}`);
			});
		});
		return response;
	}

	// Check if owner
	const row = await getModel(idName);

	if (!row) return `### Model with name "${idName}" not found`

	if (row.owner !== message.author.id) return `### You do not own the model with the name "${idName}"`

	const response = await new Promise((resolve, _) => {
		// Edit prompt
		db.run('UPDATE models SET model = ? WHERE idname = ?', [promptString, idName], async (err) => {
			if (err) {
				resolve(`### Error updating prompt for model "${idName}"`)
			}

			resolve(`### Prompt for model "${idName}" updated`)
		});
	});

	return response
}
