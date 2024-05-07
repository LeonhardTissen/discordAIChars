import { existsJson, loadJson, saveJson } from '../json.js';

const FILE_NAME = 'previousMessages';

let previousMessages = {};

// Load previous messages from JSON file on startup
if (existsJson(FILE_NAME)) {
	previousMessages = loadJson(FILE_NAME);
} else {
	saveMessagesToFile();
}

// Function to save messages to JSON file
function saveMessagesToFile() {
	saveJson(FILE_NAME, previousMessages);
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
