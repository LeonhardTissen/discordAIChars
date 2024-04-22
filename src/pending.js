import { channel } from "./channel.js";
import { addModel } from "./db.js";

export let pendingMessages = [];

export function addPendingMessage(message) {
	pendingMessages.push(message);
}

function clearPendingMessages(userId) {
	pendingMessages = pendingMessages.filter(m => m.user !== userId);
}

export function hasPendingMessage(userId) {
	return pendingMessages.some(m => m.user === userId);
}

export async function processPendingMessages(message) {
	const author = message.author.id;
	const content = message.content;
	const pendingMessage = pendingMessages.find(m => m.user === author);

	if (content === 'cancel') {
		clearPendingMessages(author);
		await channel.send('### Cancelled');
		return;
	}

	if (!pendingMessage) return;

	switch (pendingMessage.state) {
		case 'enter_name':
			// Validate name
			if (content.length < 3 || content.length > 64) {
				await channel.send('### Name must be 3-64 characters long');
				return;
			}
			pendingMessage.data.displayName = content;
			pendingMessage.data.idName = content.replace(/\s/g, '');
			if (content.includes(' ')) {
				await channel.send(`### Name sanitized to "${pendingMessage.data.idName}" but still displayed as "${pendingMessage.data.displayName}"`);
			}
			pendingMessage.state = 'enter_avatar';
			await channel.send('### Enter avatar:\n(Provide a URL, not an attachment)');
			break;
		case 'enter_avatar':
			// Validate URL
			if (!content.startsWith('http')) {
				await channel.send('### Invalid URL, please provide a valid URL');
				return;
			}

			pendingMessage.data.avatar = content;
			pendingMessage.state = 'enter_prompt';
			await channel.send('### Enter prompt:');
			break;
		case 'enter_prompt':
			// Validate prompt
			if (content.length < 32) {
				await channel.send('### Prompt must be at least 32 characters long');
				return;
			}
			pendingMessage.data.prompt = content;

			const { displayName, idName, avatar, prompt } = pendingMessage.data;

			// Save webhook to database
			addModel(idName, displayName, prompt, author, avatar);
			
			clearPendingMessages(author);

			await channel.send(`### Model "${pendingMessage.data.displayName}" created`);
			break;
	}
}
