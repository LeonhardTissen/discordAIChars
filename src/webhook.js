import { WebhookClient } from 'discord.js';
import { channel } from './channel.js';
import { FgGreen } from './utils/consolecolors.js';
import { existsJson, loadJson, saveJson } from './utils/json.js';

export let webhook = null
export let currentWebhookModel = {
	displayName: null,
	avatar: null,
}

const webhookFileName = 'webhook';

async function createWebhook() {
	const name = Math.random().toString(36).substring(7);
	webhook = await channel.createWebhook({name});
	const { id, token } = webhook;
	
	saveJson(webhookFileName, { id, token, avatar: null, name });

	console.log(`${FgGreen}Webhook created: ${webhook.id}`);
}

async function loadWebhook() {
	const webhookData = loadJson(webhookFileName);
	const { id, token, avatar, displayName } = webhookData;
	
	webhook = new WebhookClient({ id, token });
	currentWebhookModel.displayName = displayName;
	currentWebhookModel.avatar = avatar;

	console.log(`${FgGreen}Webhook loaded: ${webhook.id}`);
}

export async function updateWebhookIfNecessary(avatar, displayName) {
	// The current webhook is already what we want, no need to update
	if (
		displayName === currentWebhookModel.displayName &&
		avatar === currentWebhookModel.avatar 
	) return;

	// Update webhook
	await webhook.edit({
		name: displayName,
		avatar: avatar,
	});

	currentWebhookModel.displayName = displayName;
	currentWebhookModel.avatar = avatar;

	// Save webhook info to file
	saveJson('webhook', {
		id: webhook.id,
		token: webhook.token,
		avatar: avatar,
		name: displayName,
	});
}

export async function getOrCreateWebhook() {
	if (existsJson(webhookFileName)) {
		loadWebhook();
	} else {
		createWebhook();
	}
}
