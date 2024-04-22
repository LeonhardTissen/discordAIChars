import ollama from 'ollama';
import fs from 'fs';

import { db } from './db.js';
import { getParameters, settings } from './settings.js';
import { webhook, currentWebhookModel } from './webhook.js';
import { filterOutput } from './filter.js';
import { channel } from './channel.js';

const BASE_MODEL = process.env.BASE_MODEL;

export let defaultChannelModel = null;

export function setDefaultChannelModel(model) {
	defaultChannelModel = model;
}

export function resetDefaultChannelModel() {
	defaultChannelModel = null;
}

let isGenerating = false;

export let previousMessages = {};

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
	if (isGenerating && !settings.simultaneous_messages) {
		return;
	}
	
	// Find webhook by name
	const modelData = await new Promise((resolve, reject) => {
		db.get('SELECT idname, model, profile, displayname FROM models WHERE idname = ?', [modelName], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	// Check if model exists
	if (!modelData) {
		await channel.send(`Model with name "${modelName}" not found`);
		return;
	}

	const { profile, displayname, model, idname } = modelData;

	await updateWebhookIfNecessary(profile, displayname);

	// Lock out new messages from being processed while generating
	isGenerating = true;

	// Initialize webhook message for editing during generation
	const webhookMessage = await webhook.send(messageCursor);

	// Log the prompt
	console.log(`User: ${userInput}`);
	process.stdout.write(`${modelName}: `);


	// Add the previous messages to the model
	const messages = [];

	// System message
	messages.push({
		role: 'system',
		content: model,
	});

	// Previous messages the AI & user have sent
	previousMessages[idname]?.forEach((message) => {
		messages.push(message);
	});

	// New message from the user
	messages.push({
		role: 'user',
		content: userInput,
	});

	try {
		// Send the previous messages to the model
		const response = await ollama.chat({ 
			model: BASE_MODEL, 
			messages,
			stream: true,
			options: getParameters()
		});
		let result = '';
	
	
		// Update the message with the model's responses every second
		const interval = setInterval(() => {
			webhook.editMessage(webhookMessage.id, { 
				content: filterOutput(result) + messageCursor,
			});
		}, messageUpdateInterval);
	
		// Update the final result with the model's responses
		for await (const part of response) {
			if (!part.message?.content) continue;
	
			result += part.message.content;
	
			process.stdout.write(part.message.content);
		}
	
		clearInterval(interval);
	
		await webhook.editMessage(webhookMessage.id, { content: filterOutput(result) });
	
		process.stdout.write('\n');
	
		// Save the previous messages (Ensure the array exists)
		if (!previousMessages[idname]) {
			previousMessages[idname] = [];
		}
	
		previousMessages[idname].push({
			role: 'user',
			content: userInput,
		}, {
			role: 'assistant',
			content: result,
		});
	
		isGenerating = false;

		return result;
	} catch (err) {
		console.error(err);
		await channel.send(`### ${modelName} tragically died while generating a response.\n\n\`${err.message}\``);
		isGenerating = false;
	}
	return;
}
