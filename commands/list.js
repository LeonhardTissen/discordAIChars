import { db } from "../src/db.js";

export async function cmdList(_, message) {
	// List all models
	const modelDataArr = await new Promise((resolve, reject) => {
		db.all('SELECT idname, owner FROM models', (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		}
	)});

	if (!modelDataArr.length) {
		return '### No models found';
	}

	const yourModels = modelDataArr.filter(({ owner }) => owner === message.author.id).map(({ idname }) => idname);

	const otherModels = modelDataArr.filter(({ owner }) => owner !== message.author.id).map(({ idname }) => idname);

	return `### Your Models:\n${yourModels.join(', ')}\n### Other Models:\n${otherModels.join(', ')}`;
}
