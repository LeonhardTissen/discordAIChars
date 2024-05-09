import 'dotenv/config'

import { client } from './client.js';
import { isIgnored } from './utils/ignore.js';
import { talkToModel } from './ollama/chat.js';
import { channel } from './channel.js';
import { hasPendingMessage, processPendingMessages } from './pending.js';
import { getCallbackByCommand } from './registrar.js';
import './commands/_all.js';
import { defaultChannelModel } from './ollama/defaultmodel.js';
import { formatMessage, formatResponse } from './utils/formatter.js';

// Discord bot setup
const { BOT_TOKEN, PREFIX } = process.env;

function extractMessageParts(message) {
	const { content, author, attachments } = message;
	if (!content.startsWith(PREFIX)) return { command: null, restOfMessage: null };

	const command = content.split(' ')[0].replace(PREFIX, '');
	const restOfMessage = content.replace(PREFIX + command, '').trim();
	const args = restOfMessage.split(' ');
	const [ arg1, arg2 ] = args;
	const messageAfterArg1 = args.slice(1).join(' ');
	const messageAfterArg2 = args.slice(2).join(' ');
	const authorId = author.id;
	return { command, restOfMessage, arg1, arg2, messageAfterArg1, messageAfterArg2, authorId, message, attachments };
}


async function checkForProcessableCommands(message) {
	const parts = extractMessageParts(message);
	const { command } = parts;
	if (!command) return false; // Not a command

	const callback = getCallbackByCommand(command);
	if (!callback) return false; // No matching command found

	// Callback may send a response back, which should be sent to the channel
	const response = await callback(parts);
	if (response) {
		const responseObject = typeof response === 'string' ? [ response, null ] : response;
		const messageObject = formatMessage(... responseObject);
		channel.send(messageObject);
	}

	return true;
}

async function checkForPendingMessages(message) {
	if (hasPendingMessage(message.author.id)) {
		await processPendingMessages(message);
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

async function talkToDefaultModel(message) {
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

	if (await checkForProcessableCommands(message)) return;

	if (await checkForPendingMessages(message)) return;

	if (isInvalidCommand(message)) return;

	if (await talkToDefaultModel(message)) return;
});

export function startBot() {
	client.login(BOT_TOKEN);
}
