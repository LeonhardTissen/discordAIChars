import { getModel } from "../src/db.js";

export async function cmdInfo(restOfMessage) {
	const idName = restOfMessage;

	if (!idName) return '### Please specify a model to show info'

	const row = await getModel(idName);

	const { displayname, owner, model, profile } = row;

	if (!row) return `### Model with name "${idName}" not found`

	return `### Model info for "${displayname}":
- Avatar: ${profile}
- Owner: ${owner}
- Prompt: ${model}`
}
