export let pendingMessages = [];

export function setPendingMessages(messages) {
	pendingMessages = messages;
}

export function addPendingMessage(message) {
	pendingMessages.push(message);
}

export function clearPendingMessages(userId) {
	pendingMessages = pendingMessages.filter(m => m.user !== userId);
}
