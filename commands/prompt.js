import { db } from "../src/db.js";


export async function cmdPrompt(restOfMessage, message) {
	// Example: !prompt Ben
	const [name, ...prompt] = restOfMessage.split(' ');

	if (!name) return '### Please specify a model to show or edit the prompt'

	const promptString = prompt.join(' ');
	if (!promptString) {
		const response = await new Promise((resolve, _) => {
			db.get('SELECT model FROM models WHERE idname = ?', [name], async (err, row) => {
				if (err) {
					resolve(`### Error fetching prompt for model "${name}"`)
				}

				if (row === undefined) {
					resolve(`### Model with name "${name}" not found`)
					return;
				}

				resolve(`### Prompt for model "${name}":\n${row.model}`);
			});
		});
		return response;
	}

	// Check if owner
	const row = await new Promise((resolve, reject) => {
		db.get('SELECT owner FROM models WHERE idname = ?', [name], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	if (!row) return `### Model with name "${name}" not found`

	if (row.owner !== message.author.id) return `### You do not own the model with the name "${name}"`

	const response = await new Promise((resolve, _) => {
		// Edit prompt
		db.run('UPDATE models SET model = ? WHERE idname = ?', [promptString, name], async (err) => {
			if (err) {
				resolve(`### Error updating prompt for model "${name}"`)
			}

			resolve(`### Prompt for model "${name}" updated`)
		});
	});

	return response
}
