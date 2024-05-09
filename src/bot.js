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

function extractMessageParts(message) {
	if (!message.content.startsWith(PREFIX)) return { command: null, restOfMessage: null };

	const command = message.content.split(' ')[0].replace(PREFIX, '');
	const restOfMessage = message.content.replace(PREFIX + command, '').trim();
	return { command, restOfMessage };
}

function checkForProcessableCommands(message) {
	const { command, restOfMessage } = extractMessageParts(message);
	if (!command) return false; // Not a command

	const callback = getCallbackByCommand(command);
	if (!callback) return false; // No matching command found

	// Callback may send a response back, which should be sent to the channel
	const response = callback(restOfMessage, message);
	if (response) channel.send(response);

	return true;
}

function checkForPendingMessages(message) {
	if (hasPendingMessage(message.author.id)) {
		processPendingMessages(message);
		return true;
	}
	return false;
}

function isInvalidCommand(message) {
	if (message.content.startsWith(PREFIX)) {
		// Default response for invalid commands
		message.channel.send('### Invalid command, use `!help` for a list of commands');
		return true;
	}
	return false;
}

function talkToDefaultModel(message) {
	if (defaultChannelModel && !isIgnored(message.content)) {
		talkToModel(message.content, message, defaultChannelModel);
		return true;
	}
	return false;
}

client.on('messageCreate', async (message) => {
	// Prevent bot from responding to itself
	if (message.author.bot) return;

	// Prevent bot from responding to messages in other channels
	if (message.channel !== channel) return;

	if (checkForProcessableCommands(message)) return;

	if (checkForPendingMessages(message)) return;

	if (isInvalidCommand(message)) return;

	if (talkToDefaultModel(message)) return;
});

export function startBot() {
	client.login(BOT_TOKEN);
}
