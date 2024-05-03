import { WebhookClient } from 'discord.js';
import fs from 'fs';
import { channel } from './channel.js';
import { FgGreen } from './consolecolors.js';

export let webhook = null
export let currentWebhookModel = {
	displayName: null,
	avatar: null,
}

const webhookFilePath = 'webhook.json';

async function createWebhook() {
	const name = Math.random().toString(36).substring(7);
	webhook = await channel.createWebhook({name});
	const { id, token } = webhook;
	
	fs.writeFileSync(webhookFilePath, JSON.stringify({ id, token, avatar: null, name }));

	console.log(`${FgGreen}Webhook created: ${webhook.id}`);
}

async function loadWebhook() {
	const webhookFile = fs.readFileSync(webhookFilePath, 'utf8');
	const webhookData = JSON.parse(webhookFile);
	const { id, token, avatar, displayName } = webhookData;
	
	webhook = new WebhookClient({ id, token });
	currentWebhookModel.displayName = displayName;
	currentWebhookModel.avatar = avatar;

	console.log(`${FgGreen}Webhook loaded: ${webhook.id}`);
}

export async function getOrCreateWebhook() {
	if (fs.existsSync(webhookFilePath)) {
		loadWebhook();
	} else {
		createWebhook();
	}
}
