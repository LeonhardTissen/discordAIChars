import ollama from 'ollama';

import { getApplicableModel } from '../db.js';
import { getParameters, settings } from '../settings.js';
import { updateWebhookIfNecessary, webhook } from '../webhook.js';
import { filterOutput } from '../utils/filter.js';
import { channel } from '../channel.js';
import { color } from '../utils/consolecolors.js';
import { addMessagesTo, getAllMessagesFrom } from './previousmessages.js';
import { baseModel, imageRecognitionModel } from './basemodel.js';
import { parseSystemMessage } from './systemmessage.js';
import { WPMCounter } from '../utils/wpmcounter.js';
import { saveImage } from '../utils/imagesave.js';

let isGenerating = false;
let lastResponse = 'Introduce yourself';

const messageUpdateInterval = 1000; // in ms
const messageCursor = '▌';

async function generateIntoWebhookMessage(messages, webhookMessageId, hasImage = false) {
	const model = hasImage ? imageRecognitionModel : baseModel;

	let generatedResult = '';

	// Interval for updating the webhook message with the model's responses as they come in
	let updateInterval;

	// Flag will be set to true if the generation was successful
	let generatedSuccessfully = false;

	try {
		// Initiate the chat with the model
		const response = await ollama.chat({ 
			model, 
			messages,
			stream: true,
			options: getParameters()
		});
	
		// Update the webhook message with the model's responses at a set interval
		let lastMessageInWebhook = '';
		updateInterval = setInterval(() => {
			// Don't cause any updates if nothing has been generated yet
			if (!generatedResult) return;
	
			// Don't update the webhook if the last message is the same as the current one
			if (lastMessageInWebhook === generatedResult) return;
	
			lastMessageInWebhook = generatedResult;
	
			webhook.editMessage(webhookMessageId, { 
				content: filterOutput(generatedResult) + messageCursor,
			});
		}, messageUpdateInterval);
	
		// Continously update the result as new tokens get generated
		for await (const part of response) {
			if (!part.message?.content) continue;
	
			generatedResult += part.message.content;
	
			process.stdout.write(part.message.content);
		}

		generatedSuccessfully = true;
	} catch (err) {}

	// Generation has finished, clear the interval
	clearInterval(updateInterval);

	// Update the webhook message one last time with the final result (without the cursor)
	await webhook.editMessage(webhookMessageId, { content: filterOutput(generatedResult) });

	// Return the generated result if successful
	return generatedSuccessfully ? generatedResult : null;
}

async function formMessageHistory(userInput, systemPrompt, modelName, imagePath = null) {
	const messages = [];

	// System message
	messages.push(... parseSystemMessage(systemPrompt))

	// Previous messages the AI & user have sent
	messages.push(... getAllMessagesFrom(modelName));

	// New message from the user
	const userMessageObject = {
		role: 'user',
		content: userInput,
	}
	if (imagePath) {
		userMessageObject.images = [imagePath];
	}
	messages.push(userMessageObject);

	return messages;
}

async function getImageFromMessage(message) {
	const hasAttachments = message.attachments && message.attachments.size > 0;

	if (!hasAttachments) return { hasImage: false, imagePath: null };

	const attachment = message.attachments.first();

	const imagePath = await saveImage(attachment.url, attachment.id, 'images');

	return { hasImage: true, imagePath };
}

export async function talkToModel(userInput, message, modelName = defaultChannelModel) {
	// Prevent any other incoming messages from being processed while generating
	if (isGenerating && !settings.simultaneous_messages) return;

	const modelData = await getApplicableModel(modelName);

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

	const wpmCounter = new WPMCounter();

	// Initialize webhook message for editing during generation
	const webhookMessage = await webhook.send(messageCursor);
	const webhookMessageId = webhookMessage.id;

	// Use the last response if the user sends "last"
	if (userInput.toLowerCase() === 'last') {
		userInput = lastResponse;
	}

	// Log the prompt
	console.log(`${color.Cyan}User: ${userInput}`);
	process.stdout.write(`${color.Yellow}${displayname}: `);

	try {
		// Check if the message has an image
		const { hasImage, imagePath } = await getImageFromMessage(message);

		// Get the message list to send to the model
		const messages = await formMessageHistory(userInput, model, lowerIdName, imagePath);

		// Initiate the chat with the model
		const generatedResult = await generateIntoWebhookMessage(messages, webhookMessageId, hasImage);

		// If the generation failed, return
		if (!generatedResult) {
			isGenerating = false;
			return;
		}
	
		// Save the messages in the models message history
		addMessagesTo(lowerIdName, userInput, generatedResult);

		// Save the last response
		lastResponse = generatedResult;
	
		isGenerating = false;

		wpmCounter.logTimeAndWPM(generatedResult);

		return generatedResult;
	} catch (err) {
		console.error(`\n${color.Red}Error: ${err.message}`);
		
		isGenerating = false;
	}
}
