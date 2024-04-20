import ollama from 'ollama';
import 'dotenv/config'
import fs from 'fs';

import { db } from './db.js';
import { getHelpMessage } from './help.js';
import { client } from './client.js';
import { isIgnored } from './ignore.js';
import { filterOutput } from './filter.js';
import { currentWebhookModel, getOrCreateWebhook, webhook } from './webhook.js';

// Discord bot setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const BASE_MODEL = process.env.BASE_MODEL;
const PREFIX = process.env.PREFIX;
let channel = null;

client.once('ready', async () => {
	channel = client.channels.cache.get(CHANNEL_ID);
	await getOrCreateWebhook(channel);
});


async function talkToModel(name, prompt, message) {
	if (isGenerating) {
		return;
	}
	
	// Find webhook by name
	const row = await new Promise((resolve, reject) => {
		db.get('SELECT idname, model, profile, displayname FROM models WHERE idname = ?', [name], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		}
	)});

	// Check if model exists
	if (!row) {
		await message.channel.send(`Model with name "${name}" not found`);
		return;
	}

	if (row.avatar !== currentWebhookModel.avatar || row.displayname !== currentWebhookModel.name) {
		// Update webhook
		await webhook.edit({
			name: row.displayname,
			avatar: row.profile,
		});

		currentWebhookModel.name = row.displayname;
		currentWebhookModel.avatar = row.avatar;

		// Save webhook info to file
		fs.writeFileSync('webhook.json', JSON.stringify({
			id: webhook.id,
			token: webhook.token,
			avatar: row.profile,
			name: row.displayname,
		}));
	}

	// Lock out new messages from being processed while generating
	isGenerating = true;

	// Initialize webhook message for editing during generation
	const webhookMessage = await webhook.send(messageCursor);

	// Log the prompt
	console.log(`${message.author.username}: ${prompt}`);
	process.stdout.write(`${name}: `);


	// Add the previous messages to the model
	const messages = [];

	// System message
	messages.push({
		role: 'system',
		content: row.model,
	});

	// Previous messages the AI & user have sent
	previousMessages[row.idname]?.forEach((message) => {
		messages.push(message);
	});

	// New message from the user
	messages.push({
		role: 'user',
		content: prompt,
	});

	// Send the previous messages to the model
	const response = await ollama.chat({ 
		model: BASE_MODEL, 
		messages,
		stream: true,
		options: {
			num_predict: 500,
		}
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
		if (!part.message || !part.message.content) continue;

		result += part.message.content;

		process.stdout.write(part.message.content);
	}

	clearInterval(interval);

	await webhook.editMessage(webhookMessage.id, { content: filterOutput(result) });

	process.stdout.write('\n');

	// Save the previous messages (Ensure the array exists)
	if (!previousMessages[row.idname]) {
		previousMessages[row.idname] = [];
	}

	previousMessages[row.idname].push({
		role: 'user',
		content: prompt,
	}, {
		role: 'assistant',
		content: result,
	});

	isGenerating = false;
	return;
}



let pendingMessages = [];
let previousMessages = {};
let defaultChannelModel = null;
let isGenerating = false;

const messageUpdateInterval = 1000; // in ms
const messageCursor = '▌';

client.on('messageCreate', async (message) => {
	// Prevent bot from responding to itself
	if (message.author.bot) return;

	// Prevent bot from responding to messages in other channels
	if (message.channel !== channel) return;

	let command = null;
	let restOfMessage = null;
	if (message.content.startsWith(PREFIX)) {
		command = message.content.split(' ')[0].replace(PREFIX, '');
		restOfMessage = message.content.replace(`${PREFIX}${command}`, '').trim();
	};

	if (command === 'create') {
		// Ask user to provide a name for the webhook
		pendingMessages.push({
			user: message.author.id,
			data: {},
			state: 'enter_name',
		});
		await message.channel.send('### Enter name:');
		return;
	}

	if (command === 'default') {
		// Example: !default Ben
		const model = restOfMessage;

		
		if (model === '') {
			defaultChannelModel = null;
			await message.channel.send('### Default model cleared');
			return;
		}

		const row = await new Promise((resolve, reject) => {
			db.get('SELECT idname FROM models WHERE idname = ?', [model], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			})
		});

		if (!row) {
			await message.channel.send(`### Model with name "${model}" not found`);
			return;
		}

		defaultChannelModel = model;
		await message.channel.send(`### Default model set to "${model}"\nThis means you can talk to this model without running the !ask command.`);
		return;
	}

	if (command === 'clear') {
		const [model, amount] = restOfMessage.split(' ');

		if (model === '') {
			await message.channel.send('### Please specify a model to clear');
			return;
		}

		const row = await new Promise((resolve, reject) => {
			db.get('SELECT idname FROM models WHERE idname = ?', [model], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			})
		});

		if (!row) {
			await message.channel.send(`### Model with name "${model}" not found`);
			return;
		}

		if (!amount) {
			previousMessages[model] = [];
			await message.channel.send(`### Chat history for model "${model}" cleared`);
		} else {
			const num = parseInt(amount);
			if (isNaN(num)) {
				await message.channel.send('### Please specify a valid number of messages to clear');
				return;
			}

			previousMessages[model] = previousMessages[model].slice(0, -num * 2);
			await message.channel.send(`### Last ${num} messages cleared for model "${model}"`);
		}
		return;
	}

	if (command === 'debug') {
		console.log(previousMessages);
		return;
	}

	if (command === 'delete') {
		// Example: !delete Ben
		const name = restOfMessage;

		if (name === '') {
			await message.channel.send('### Please specify a model to delete');
			return;
		}

		// Find webhook by name
		const row = await new Promise((resolve, reject) => {
			db.get('SELECT idname, owner FROM models WHERE idname = ?', [name], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			}
		)});

		if (!row) {
			await message.channel.send(`### Model with name "${name}" not found`);
			return;
		}

		if (row.owner !== message.author.id) {
			await message.channel.send(`### You do not own the model with the name "${name}"`);
			return;
		}

		// Delete model from database
		db.run('DELETE FROM models WHERE idname = ?', [row.idname]);

		await message.channel.send(`### Model with name "${name}" deleted`);

		return;
	}

	if (command === 'list') {
		// List all models
		const rows = await new Promise((resolve, reject) => {
			db.all('SELECT idname, owner FROM models', (err, rows) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		)});

		if (!rows.length) {
			await message.channel.send('No models found');
			return;
		}

		const models = rows.map((row) => {
			return `${row.idname}${row.owner === message.author.id ? ' (yours)' : ''}`;
		}).join('\n');

		await message.channel.send(`### Models:\n${models}`);
		return;
	}

	if (command === 'prompt') {
		// Example: !prompt Ben
		const [name, ...prompt] = restOfMessage.split(' ');
		if (!name) {
			await message.channel.send('### Please specify a model to show or edit the prompt');
			return;
		}

		const promptString = prompt.join(' ');
		if (!promptString) {
			// Show prompt
			db.get('SELECT model FROM models WHERE idname = ?', [name], async (err, row) => {
				if (err) {
					console.error(err);
					return;
				}

				if (!row) {
					await message.channel.send(`Model with name "${name}" not found`);
					return;
				}

				await message.channel.send(`### Prompt for model "${name}":\n${row.model}`);
			});
		} else {
			// Check if owner
			const row = await new Promise((resolve, reject) => {
				db.get('SELECT owner FROM models WHERE idname = ?', [name], (err, row) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(row);
				}
			)});

			if (!row) {
				await message.channel.send(`### Model with name "${name}" not found`);
				return;
			}

			if (row.owner !== message.author.id) {
				await message.channel.send(`### You do not own the model with the name "${name}"`);
				return;
			}

			// Edit prompt
			db.run('UPDATE models SET model = ? WHERE idname = ?', [promptString, name], async (err) => {
				if (err) {
					console.error(err);
					return;
				}

				await message.channel.send(`### Prompt for model "${name}" updated`);
			});

		}
		return;
	}


	if (command === 'info') {
		const name = restOfMessage;

		if (!name) {
			await message.channel.send('### Please specify a model to show info');
			return;
		}

		const row = await new Promise((resolve, reject) => {
			db.get('SELECT idname, displayname, owner, model, profile FROM models WHERE idname = ?', [name], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			}
		)});

		if (!row) {
			await message.channel.send(`### Model with name "${name}" not found`);
			return;
		}

		await message.channel.send(`### Model info for "${row.displayname}":
- Avatar: ${row.profile}
- Owner: ${row.owner}
- Prompt: ${row.model}`);
		return;
	}



	if (command === 'transfer') {
		// Example: !transfer Ben userid
		let [name, user] = restOfMessage.split(' ');

		// Remove non-numeric characters from user
		user = user.replace(/[^0-9]/g, '');

		if (!name || !user) {
			await message.channel.send('### Please specify a model and a user to transfer ownership');
			return;
		}

		// Check if owner
		const row = await new Promise((resolve, reject) => {
			db.get('SELECT owner FROM models WHERE idname = ?', [name], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			}
		)});

		if (!row) {
			await message.channel.send(`### Model with name "${name}" not found`);
			return;
		}

		if (row.owner !== message.author.id) {
			await message.channel.send(`### You do not own the model with the name "${name}"`);
			return;
		}

		// Transfer ownership
		db.run('UPDATE models SET owner = ? WHERE idname = ?', [user, name], async (err) => {
			if (err) {
				console.error(err);
				return;
			}

			await message.channel.send(`### Model "${name}" transferred to <@${user}>, they are now the owner`);
		});

		return;
	}


	if (command === 'ask') {
		// Example: !ask Ben What is the capital of France?
		const [name, ...prompt] = restOfMessage.split(' ');
		const promptString = prompt.join(' ');

		talkToModel(name, promptString, message);
		return;
	}


	if (command === 'basemodel') {
		await message.channel.send(`### Base model: ${BASE_MODEL}`);
		return;
	}


	if (command === 'help') {
		await message.channel.send(getHelpMessage());
		return;
	}

	// Process pending messages
	const hadPendingMessage = pendingMessages.some(async (pendingMessage) => {
		if (pendingMessage.user === message.author.id) {
			switch (pendingMessage.state) {
				case 'enter_name':
					// Validate name
					if (message.content.length < 3 || message.content.length > 20) {
						await message.channel.send('### Name must be 3-20 characters long');
						return;
					}
					pendingMessage.data.displayName = message.content;
					pendingMessage.data.idName = message.content.replace(/\s/g, '');
					if (message.content.includes(' ')) {
						await message.channel.send(`### Name sanitized to "${pendingMessage.data.idName}" but still displayed as "${pendingMessage.data.displayName}"`);
					}
					pendingMessage.state = 'enter_avatar';
					await message.channel.send('### Enter avatar:\n(Provide a URL, not an attachment)');
					break;
				case 'enter_avatar':
					// Validate URL
					if (!message.content.startsWith('http')) {
						await message.channel.send('### Invalid URL, please provide a valid URL');
						return;
					}

					pendingMessage.data.avatar = message.content;
					pendingMessage.state = 'enter_prompt';
					await message.channel.send('### Enter prompt:');
					break;
				case 'enter_prompt':
					// Validate prompt
					if (message.content.length < 32) {
						await message.channel.send('### Prompt must be at least 32 characters long');
						return;
					}
					pendingMessage.data.prompt = message.content;

					// Save webhook to database
					db.run('INSERT INTO models (idname, displayname, model, owner, profile) VALUES (?, ?, ?, ?, ?)', [
						pendingMessage.data.idName,
						pendingMessage.data.displayName,
						pendingMessage.data.prompt, 
						message.author.id,
						pendingMessage.data.avatar,
					]);
					
					pendingMessages = pendingMessages.filter((pm) => pm.user !== message.author.id);

					await message.channel.send(`### Model "${pendingMessage.data.displayName}" created`);
					break;
			}
			return true;
		}
	});

	if (hadPendingMessage) return;

	// Talk to default model
	if (defaultChannelModel && !isIgnored(message.content)) {
		talkToModel(defaultChannelModel, message.content, message);
	}


});

export function startBot() {
	client.login(BOT_TOKEN);
}
