import { WebhookClient } from 'discord.js';
import fs from 'fs';

export let webhook = null
export let currentWebhookModel = {
	name: null,
	avatar: null,
}

export async function getOrCreateWebhook(channel) {
	if (fs.existsSync('webhook.json')) {
		// Load webhook from file
		const webhookFile = fs.readFileSync('webhook.json', 'utf8');
		const webhookData = JSON.parse(webhookFile);
		webhook = new WebhookClient({
			id: webhookData.id,
			token: webhookData.token
		});
		currentWebhookModel.name = webhookData.name;
		currentWebhookModel.avatar = webhookData.avatar;

		console.log(`Webhook loaded: ${webhook.id}`);
	} else {
		// Create webhook
		const name = Math.random().toString(36).substring(7);
		webhook = await channel.createWebhook(name);
		
		fs.writeFileSync('webhook.json', JSON.stringify({
			id: webhook.id,
			token: webhook.token,
			avatar: null,
			name
		}));

		console.log(`Webhook created: ${webhook.id}`);
	}
}
