import { channel } from "./channel.js";
import { addModel, getModel } from "./db.js";
import { formatMessage } from "./utils/formatter.js";
import { saveImage } from "./utils/imagesave.js";

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

async function pendingEnterName({ pendingMessage, content }) {
	if (content.length < 3 || content.length > 64) return 'Name must be 3-64 characters long';

	if (content.toLowerCase() === 'random') return 'Name cannot be "random"';

	// Webhook names cannot contain "Discord"
	content = content.replace(/Discord/gi, 'Disc0rd');
	
	if (await getModel(content)) return 'Name already taken, choose another';

	pendingMessage.data.displayName = content;
	pendingMessage.data.idName = content.replace(/\s/g, '');
	if (content.includes(' ')) {
		await channel.send(`Name sanitized to "${pendingMessage.data.idName}" but still displayed as "${pendingMessage.data.displayName}"`);
	}
	pendingMessage.state = 'enter_avatar';
	return 'Upload avatar as attachment:';
}

async function pendingEnterAvatar({ pendingMessage, message }) {
	// Check if valid URL
	if (message.attachments.size === 0) return 'Upload an image';

	pendingMessage.data.attachment = message.attachments.first();
	pendingMessage.state = 'enter_prompt';
	return 'Enter prompt:';
}

async function pendingEnterPrompt({ pendingMessage, content, author }) {
	if (content.length < 32) return 'Prompt must be at least 32 characters long';

	pendingMessage.data.prompt = content;

	const { displayName, idName, attachment, prompt } = pendingMessage.data;

	const lowerIdName = idName.toLowerCase();

	// Save avatar to disk
	const avatarPath = await saveImage(attachment.url, lowerIdName, 'avatars');

	// Save model to database
	addModel(idName, displayName, prompt, author, avatarPath);
	
	clearPendingMessages(author);

	return `Model "${pendingMessage.data.displayName}" created`;
}

const stateCallbacks = {
	enter_name: pendingEnterName,
	enter_avatar: pendingEnterAvatar,
	enter_prompt: pendingEnterPrompt,
};

export async function processPendingMessages(message) {
	const author = message.author.id;
	const content = message.content;
	const pendingMessage = pendingMessages.find(m => m.user === author);

	if (content === 'cancel') {
		clearPendingMessages(author);
		await channel.send(formatMessage('Canceled interaction'));
		return;
	}

	if (!pendingMessage) return;

	const callback = stateCallbacks[pendingMessage.state];
	if (!callback) return;

	const response = await callback({ pendingMessage, content, author, message });
	if (!response) return;

	channel.send(formatMessage(response));
}
