import { db } from "../src/db.js";
import { resetDefaultChannelModel, setDefaultChannelModel } from "../src/ollama.js";


export async function cmdDefault(restOfMessage) {
	// Example: !default Ben
	const model = restOfMessage;

		
	if (model === '') {
		resetDefaultChannelModel();
		return '### Default model cleared'
	}

	const modelData = await new Promise((resolve, reject) => {
		db.get('SELECT idname FROM models WHERE idname = ?', [model], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		})
	});

	if (!modelData) {
		await message.channel.send(`### Model with name "${model}" not found`);
		return;
	}

	setDefaultChannelModel(model);
	return `### Default model set to "${model}"\nThis means you can talk to this model without running the !ask command.`
}
