import { db } from "../src/db.js";

export async function cmdInfo(restOfMessage) {
	const idName = restOfMessage;

	if (!idName) return '### Please specify a model to show info'

	const row = await new Promise((resolve, reject) => {
		db.get('SELECT idname, displayname, owner, model, profile FROM models WHERE idname = ?', [idName], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	const { displayname, owner, model, profile } = row;

	if (!row) return `### Model with name "${idName}" not found`

	return `### Model info for "${displayname}":
- Avatar: ${profile}
- Owner: ${owner}
- Prompt: ${model}`
}
