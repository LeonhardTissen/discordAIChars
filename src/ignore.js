// Prevent messages from going into the AI if they start with # or _
export function isIgnored(message) {
	return message.startsWith('#') || message.startsWith('_') || message.length === 0;
}
