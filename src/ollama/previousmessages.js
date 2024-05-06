import fs from 'fs';
import { FgRed } from '../consolecolors.js';

const FILE_PATH = 'previousMessages.json';

let previousMessages = {};

// Load previous messages from JSON file on startup
try {
	const data = fs.readFileSync(FILE_PATH);
	previousMessages = JSON.parse(data);
} catch (err) {
	if (err.code === 'ENOENT') {
		// If the file does not exist, create an empty object
		fs.writeFileSync(FILE_PATH, JSON.stringify(previousMessages), 'utf8');
	} else {
		console.error(`${FgRed}Error loading previous messages:${err}`);
	}
}

// Function to save messages to JSON file
function saveMessagesToFile() {
	fs.writeFile(FILE_PATH, JSON.stringify(previousMessages, null, 2), 'utf8', (err) => {
		if (err) {
			console.error(`${FgRed}Error saving previous messages:${err}`);
		}
	});
}

export function getAllMessages() {
	return previousMessages;
}

export function getAllMessagesFrom(modelName) {
	return previousMessages[modelName.toLowerCase()] ?? [];
}

export function clearMessagesFrom(modelName) {
	previousMessages[modelName.toLowerCase()] = [];
	saveMessagesToFile();
}

export function clearLastMessagesFrom(modelName, amount) {
	const lowerModelName = modelName.toLowerCase();
	previousMessages[lowerModelName] = previousMessages[lowerModelName].slice(0, -amount * 2);
	saveMessagesToFile();
}

export function clearAllMessages() {
	previousMessages = {};
	saveMessagesToFile();
}

export function addMessagesTo(modelName, userMessageContent, assistantMessageContent) {
	const lowerModelName = modelName.toLowerCase();

	if (!previousMessages[lowerModelName]) {
		previousMessages[lowerModelName] = [];
	}

	const userMessage = {
		role: 'user',
		content: userMessageContent,
	};
	const assistantMessage = {
		role: 'assistant',
		content: assistantMessageContent,
	};

	previousMessages[lowerModelName].push(userMessage, assistantMessage);
	saveMessagesToFile();
}
