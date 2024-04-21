import 'dotenv/config'

import { db } from './src/db.js';
import { client } from './src/client.js';
import { isIgnored } from './src/ignore.js';
import { getOrCreateWebhook } from './src/webhook.js';
import { defaultChannelModel, talkToModel } from './src/ollama.js';
import { channel, setChannel } from './src/channel.js';
import { clearPendingMessages, pendingMessages } from './src/pending.js';
import { commandList } from './commands.js';

// Discord bot setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PREFIX = process.env.PREFIX;

client.once('ready', async () => {
	setChannel(client.channels.cache.get(CHANNEL_ID));
	await getOrCreateWebhook();
});

client.on('messageCreate', async (message) => {
	// Prevent bot from responding to itself
	if (message.author.bot) return;

	// Prevent bot from responding to messages in other channels
	if (message.channel !== channel) return;

	let command = null;
	let restOfMessage = null;
	if (message.content.startsWith(PREFIX)) {
		command = message.content.split(' ')[0].replace(PREFIX, '');
		restOfMessage = message.content.replace(PREFIX + command, '').trim();
	};

	if (command in commandList) {
		const response = await commandList[command](restOfMessage, message);
		if (response) {
			await message.channel.send(response);
		}
		return;
	}

	// Process pending messages
	const hadPendingMessage = pendingMessages.some(async (pendingMessage) => {
		if (pendingMessage.user === message.author.id) {
			switch (pendingMessage.state) {
				case 'enter_name':
					// Validate name
					if (message.content.length < 3 || message.content.length > 64) {
						await message.channel.send('### Name must be 3-64 characters long');
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
					
					clearPendingMessages(message.author.id);

					await message.channel.send(`### Model "${pendingMessage.data.displayName}" created`);
					break;
			}
			return true;
		}
	});

	// Don't process default model if there was a pending message
	if (hadPendingMessage) return;

	// Default response for invalid commands
	if (message.content.startsWith(PREFIX)) {
		await message.channel.send('### Invalid command, use `!help` for a list of commands');
		return;
	}

	// Talk to default model
	if (defaultChannelModel && !isIgnored(message.content)) {
		talkToModel(message.content, defaultChannelModel);
	}


});

export function startBot() {
	client.login(BOT_TOKEN);
}
