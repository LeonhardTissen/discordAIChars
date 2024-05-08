import 'dotenv/config'

import { client } from './client.js';
import { isIgnored } from './utils/ignore.js';
import { talkToModel } from './ollama/chat.js';
import { channel } from './channel.js';
import { hasPendingMessage, processPendingMessages } from './pending.js';
import { getCallbackByCommand } from './registrar.js';
import './commands.js';
import { defaultChannelModel } from './ollama/defaultmodel.js';

// Discord bot setup
const { BOT_TOKEN, PREFIX } = process.env;

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
	const callback = getCallbackByCommand(command);
	if (callback) {
		const response = await callback(restOfMessage, message);
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
		talkToModel(message.content, message, defaultChannelModel);
	}
});

export function startBot() {
	client.login(BOT_TOKEN);
}
