import { getAllModels } from "../src/db.js";

export async function cmdList(_, message) {
	// List all models
	const modelDataArr = await getAllModels();

	if (!modelDataArr.length) return '### No models found';

	const yourModels = [];
	const otherModels = [];

	for (const { idname, owner } of modelDataArr) {
		if (owner === message.author.id) {
			yourModels.push(idname);
		} else {
			otherModels.push(idname);
		}
	}

	return `### Your Models:\n${yourModels.join(', ')}\n### Other Models:\n${otherModels.join(', ')}`;
}
