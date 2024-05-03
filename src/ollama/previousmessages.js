let previousMessages = {};

export function getAllMessages() {
	return previousMessages;
}

export function getAllMessagesFrom(modelName) {
	return previousMessages[modelName.toLowerCase()] ?? [];
}

export function clearMessagesFrom(modelName) {
	previousMessages[modelName.toLowerCase()] = [];
}

export function clearLastMessagesFrom(modelName, amount) {
	const lowerModelName = modelName.toLowerCase();
	previousMessages[lowerModelName] = previousMessages[lowerModelName].slice(0, -amount * 2);
}

export function clearAllMessages() {
	previousMessages = {};
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
}
