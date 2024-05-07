import { WebhookClient } from 'discord.js';
import { channel } from './channel.js';
import { FgGreen } from './consolecolors.js';
import { existsJson, loadJson, saveJson } from './json.js';

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

export async function getOrCreateWebhook() {
	if (existsJson(webhookFileName)) {
		loadWebhook();
	} else {
		createWebhook();
	}
}
