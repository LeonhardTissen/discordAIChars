import 'dotenv/config'

import { client } from './src/client.js';
import { isIgnored } from './src/ignore.js';
import { getOrCreateWebhook } from './src/webhook.js';
import { defaultChannelModel, talkToModel } from './src/ollama.js';
import { channel, setChannel } from './src/channel.js';
import { hasPendingMessage, processPendingMessages } from './src/pending.js';
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

	// Process commands
	if (command in commandList) {
		const response = await commandList[command](restOfMessage, message);
		if (response) channel.send(response)
		return;
	}

	// Process pending messages
	if (hasPendingMessage(message.author.id)) {
		await processPendingMessages(message);
		return;
	}

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
