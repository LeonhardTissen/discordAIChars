import ollama from 'ollama';
import fs from 'fs';

import { getModel, getRandomModel } from '../db.js';
import { getParameters, settings } from '../settings.js';
import { webhook, currentWebhookModel } from '../webhook.js';
import { filterOutput } from '../filter.js';
import { channel } from '../channel.js';
import { FgBlue, FgCyan, FgYellow } from '../consolecolors.js';
import { addMessagesTo, getAllMessagesFrom } from './previousmessages.js';
import { isForceStopped, resetForceStop } from './forcestop.js';
import { baseModel } from './basemodel.js';
import { parseSystemMessage } from './systemmessage.js';

let isGenerating = false;
let lastResponse = 'Introduce yourself';

const messageUpdateInterval = 1000; // in ms
const messageCursor = '▌';

async function updateWebhookIfNecessary(avatar, displayName) {
	if (
		displayName !== currentWebhookModel.displayName ||
		avatar !== currentWebhookModel.avatar 
	) {
		// Update webhook
		await webhook.edit({
			name: displayName,
			avatar: avatar,
		});

		currentWebhookModel.displayName = displayName;
		currentWebhookModel.avatar = avatar;

		// Save webhook info to file
		fs.writeFileSync('webhook.json', JSON.stringify({
			id: webhook.id,
			token: webhook.token,
			avatar: avatar,
			name: displayName,
		}));
	}
}

export async function talkToModel(userInput, modelName = defaultChannelModel) {
	// Prevent any other incoming messages from being processed while generating
	if (isGenerating && !settings.simultaneous_messages) return;

	const isRandom = modelName.toLowerCase() === 'random';

	const modelData = isRandom ? await getRandomModel() : await getModel(modelName);

	// Check if model exists
	if (!modelData) {
		await channel.send(`### Model with name "${modelName}" not found`);
		return;
	}

	const { profile, displayname, model, idname } = modelData;

	const lowerIdName = idname.toLowerCase();

	await updateWebhookIfNecessary(profile, displayname);

	// Lock out new messages from being processed while generating
	if (!settings.simultaneous_messages) {
		isGenerating = true;
	}

	const startedGenerating = Date.now();

	resetForceStop();

	// Initialize webhook message for editing during generation
	const webhookMessage = await webhook.send(messageCursor);
	const webhookMessageId = webhookMessage.id;

	// Use the last response if the user sends "last"
	if (userInput.toLowerCase() === 'last') {
		userInput = lastResponse;
	}

	// Log the prompt
	console.log(`${FgCyan}User: ${userInput}`);
	process.stdout.write(`${FgYellow}${displayname}: `);


	// Add the previous messages to the model
	let messages = [];

	// System message
	messages.push(... parseSystemMessage(model))

	// Previous messages the AI & user have sent
	messages = messages.concat(getAllMessagesFrom(lowerIdName));

	// New message from the user
	messages.push({
		role: 'user',
		content: userInput,
	});

	try {
		// Initiate the chat with the model
		const response = await ollama.chat({ 
			model: baseModel, 
			messages,
			stream: true,
			options: getParameters()
		});
		let generatedResult = '';
	
		// Update the webhook message with the model's responses every second
		const interval = setInterval(() => {
			// Don't cause any updates if nothing has been generated yet
			if (!generatedResult) return;

			webhook.editMessage(webhookMessageId, { 
				content: filterOutput(generatedResult) + messageCursor,
			});
		}, messageUpdateInterval);
	
		// Update the final result with the model's responses
		for await (const part of response) {
			if (!part.message?.content) continue;
	
			generatedResult += part.message.content;
	
			process.stdout.write(part.message.content);

			if (isForceStopped) break;
		}
	
		clearInterval(interval);
	
		await webhook.editMessage(webhookMessageId, { content: filterOutput(generatedResult) });
	
		process.stdout.write('\n');
	
		// Save the messages in the models message history
		addMessagesTo(lowerIdName, userInput, generatedResult);

		// Save the last response
		lastResponse = generatedResult;
	
		isGenerating = false;

		// Log the time it took to generate the response along with the words per minute
		const timeToGenerate = (Date.now() - startedGenerating) / 1000;
		const wordsPerMinute = Math.round((generatedResult.split(' ').length / timeToGenerate) * 60);

		console.log(`${FgBlue}Time to generate: ${timeToGenerate}s, Words per minute: ${wordsPerMinute}`);

		return generatedResult;
	} catch (err) {
		console.error(err);
		await channel.send(`### ${modelName} tragically died while generating a response.\n\n\`${err.message}\``);
		isGenerating = false;
	}
}
