import ollama from 'ollama';
import { Client, GatewayIntentBits, Partials, WebhookClient } from 'discord.js';
import 'dotenv/config'
import sqlite3 from 'sqlite3';









// Database setup
const db = new sqlite3.Database('database.db');

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS models (id TEXT UNIQUE, username TEXT, model TEXT, token TEXT, owner TEXT)');
});




// Discord bot setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});




// Webhook handling
let webhooks = {};
async function createWebhook(name, avatar) {
	return client.channels.cache.get(CHANNEL_ID).createWebhook({
		name,
		avatar,
	});
}

async function getWebhook(id) {
	console.log('Looking for webhook:', id);
	if (webhooks[id]) {
		console.log('Webhook found in cache');
		return webhooks[id];
	}
	console.log('Webhook not found in cache, fetching all webhooks in', CHANNEL_ID);
	const newWebhooks = await client.channels.cache.get(CHANNEL_ID).fetchWebhooks();
	newWebhooks.forEach((webhook) => {
		console.log('Caching webhook:', webhook.id);
		webhooks[webhook.id] = webhook;
	});
	if (!webhooks[id]) {
		console.error('Webhook not found:', id);
		return;
	}
	return webhooks[id];
}




client.once('ready', () => {
    console.log('Bot is online!');
});



async function talkToModel(name, prompt, message) {
	// Find webhook by name
	db.get('SELECT id, model, token FROM models WHERE username = ?', [name], async (err, row) => {
		if (err) {
			console.error(err);
			return;
		}

		if (!row) {
			await message.channel.send(`Webhook with name "${name}" not found`);
			return;
		}


		const webhookClient = new WebhookClient({ id: row.id, token: row.token });
		const webhookMessage = await webhookClient.send(messageCursor);

		console.log(`${message.author.username}: ${prompt}`);
		process.stdout.write(`${name}: `);

		const messages = [];

		// Add the previous messages to the model
		messages.push({
			role: 'system',
			content: row.model,
		});
		previousMessages[row.id]?.forEach((message) => {
			messages.push(message);
		});
		messages.push({
			role: 'user',
			content: prompt,
		});

		// Send the previous messages to the model
		const response = await ollama.chat({ 
			model: 'llama3', 
			messages,
			stream: true,
			options: {
				num_predict: 500,
			}
		});
		let result = '';
		const interval = setInterval(() => {
			webhookClient.editMessage(webhookMessage.id, { 
				content: result + messageCursor,
			});
		}, messageUpdateInterval);

		// Update the final result with the model's responses
		for await (const part of response) {
			if (!part.message || !part.message.content) continue;

			result += part.message.content;

			process.stdout.write(part.message.content);
		}

		clearInterval(interval);

		await webhookClient.editMessage(webhookMessage.id, { content: result });

		process.stdout.write('\n');

		// Save the previous messages
		if (!previousMessages[row.id]) {
			previousMessages[row.id] = [];
		}

		previousMessages[row.id].push({
			role: 'user',
			content: prompt,
		});
		previousMessages[row.id].push({
			role: 'assistant',
			content: result,
		});
	});
	return;
}



let pendingMessages = [];
let previousMessages = {};
let defaultChannelModel = null;

const messageUpdateInterval = 1000;
const messageCursor = '▌';

client.on('messageCreate', async (message) => {
	// Prevent bot from responding to itself
	if (message.author.bot) return;

	// Prevent bot from responding to messages in other channels
	if (message.channel.id !== CHANNEL_ID) return;

	if (message.content.startsWith('!create')) {
		// Ask user to provide a name for the webhook
		pendingMessages.push({
			user: message.author.id,
			data: {},
			state: 'enter_name',
		});
		await message.channel.send('## Enter name:');
		return;
	}

	if (message.content.startsWith('!default')) {
		// Example: !default Ben
		const model = message.content.replace('!default ', '');

		defaultChannelModel = model;
		await message.channel.send(`## Default model set to "${model}"\nThis means you can talk to this model without running the !ask command.`);
		return;
	}

	if (message.content.startsWith('!delete')) {
		// Example: !delete Ben
		const name = message.content.replace('!delete ', '');

		// Find webhook by name
		db.get('SELECT id, owner FROM models WHERE username = ?', [name], async (err, row) => {
			if (err) {
				console.error(err);
				return;
			}

			if (!row) {
				await message.channel.send(`Webhook with name "${name}" not found`);
				return;
			}

			if (row.owner !== message.author.id) {
				await message.channel.send(`You do not own the webhook with name "${name}"`);
				return;
			}

			// Delete webhook
			const webhook = await getWebhook(row.id);
			await webhook.delete();
		});
		return;
	}

	if (message.content.startsWith('!list')) {
		// List all webhooks
		db.all('SELECT username FROM models WHERE owner = ?', [message.author.id], async (err, rows) => {
			if (err) {
				console.error(err);
				return;
			}

			if (!rows.length) {
				await message.channel.send('No webhooks found');
				return;
			}

			const names = rows.map((row) => row.username).join(', ');
			await message.channel.send(`## Webhooks:\n${names}`);
		});
		return;
	}

	if (message.content.startsWith('!ask')) {
		// Example: !ask Ben What is the capital of France?
		const [_, name, ...prompt] = message.content.split(' ');
		const promptString = prompt.join(' ');

		talkToModel(name, promptString, message);
	}

	// Process pending messages
	const hadPendingMessage = pendingMessages.some(async (pendingMessage) => {
		if (pendingMessage.user === message.author.id) {
			switch (pendingMessage.state) {
				case 'enter_name':
					// Validate name
					if (message.content.length < 3) {
						await message.channel.send('## Name must be at least 3 characters long');
						return;
					}
					pendingMessage.data.name = message.content;
					pendingMessage.state = 'enter_avatar';
					await message.channel.send('## Enter avatar:\n(Provide a URL, not an attachment)');
					break;
				case 'enter_avatar':
					// Validate URL
					if (!message.content.startsWith('http')) {
						await message.channel.send('## Invalid URL, please provide a valid URL');
						return;
					}

					pendingMessage.data.avatar = message.content;
					pendingMessage.state = 'enter_prompt';
					await message.channel.send('## Enter prompt:');
					break;
				case 'enter_prompt':
					// Validate prompt
					if (message.content.length < 32) {
						await message.channel.send('## Prompt must be at least 32 characters long');
						return;
					}
					pendingMessage.data.prompt = message.content;

					// Create webhook
					const webhook = await createWebhook(pendingMessage.data.name, pendingMessage.data.avatar);

					// Send message via webhook
					await webhook.send("I've been birthed!");

					// Save webhook to database
					db.run('INSERT INTO models (id, username, model, token, owner) VALUES (?, ?, ?, ?, ?)', [
						webhook.id, 
						pendingMessage.data.name, 
						pendingMessage.data.prompt, 
						webhook.token,
						message.author.id,
					]);
					
					pendingMessages = pendingMessages.filter((pm) => pm.user !== message.author.id);
					break;
			}
			return true;
		}
	});

	if (hadPendingMessage) return;

	// Talk to default model
	if (defaultChannelModel) {
		talkToModel(defaultChannelModel, message.content, message);
	}


});

client.login(BOT_TOKEN);
