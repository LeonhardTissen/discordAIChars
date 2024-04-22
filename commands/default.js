import { getModel } from "../src/db.js";
import { resetDefaultChannelModel, setDefaultChannelModel } from "../src/ollama.js";


export async function cmdDefault(restOfMessage) {
	// Example: !default Ben
	const idName = restOfMessage;

		
	if (idName === '') {
		resetDefaultChannelModel();
		return '### Default model cleared'
	}

	const modelData = await getModel(idName);

	if (!modelData) {
		await message.channel.send(`### Model with name "${idName}" not found`);
		return;
	}

	setDefaultChannelModel(idName);
	return `### Default model set to "${idName}"\nThis means you can talk to this model without running the !ask command.`
}
