import { addModel, getModel } from "./db.js";
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
	let addedInfo = '';
	if (content.includes(' ')) {
		addedInfo += `\nInfo: Name sanitized to "${pendingMessage.data.idName}" but still displayed as "${pendingMessage.data.displayName}"`;
	}
	pendingMessage.state = 'enter_avatar';
	return 'Upload avatar as attachment:' + addedInfo;
}

async function pendingEnterAvatar({ pendingMessage, attachments }) {
	// Check if valid URL
	if (attachments.size === 0) return 'Upload an image';

	// Check if png, jpg, jpeg or webp
	const attachment = attachments.first();
	const validExtensions = ['png', 'jpg', 'jpeg', 'webp'];
	const extension = attachment.url.split('.').pop().split(/\#|\?/)[0];
	if (!validExtensions.includes(extension)) return 'Avatar must be a PNG, JPG, JPEG or WEBP image';

	pendingMessage.data.attachment = attachment;
	pendingMessage.state = 'enter_prompt';
	return 'Enter prompt:';
}

async function pendingEnterPrompt({ pendingMessage, content, authorId }) {
	if (content.length < 32) return 'Prompt must be at least 32 characters long';

	pendingMessage.data.prompt = content;

	const { displayName, idName, attachment, prompt } = pendingMessage.data;

	const lowerIdName = idName.toLowerCase();

	// Save avatar to disk
	const avatarPath = await saveImage(attachment.url, lowerIdName, 'avatars');

	// Save model to database
	addModel(idName, displayName, prompt, authorId, avatarPath);
	
	clearPendingMessages(authorId);

	return `Model "${pendingMessage.data.displayName}" created`;
}

const stateCallbacks = {
	enter_name: pendingEnterName,
	enter_avatar: pendingEnterAvatar,
	enter_prompt: pendingEnterPrompt,
};

export async function processPendingMessages(message) {
	const { content, attachments, author } = message;
	const authorId = author.id;
	const pendingMessage = pendingMessages.find(m => m.user === authorId);

	if (content === 'cancel') {
		clearPendingMessages(author);
		return 'Canceled interaction'
	}

	if (!pendingMessage) return;

	const callback = stateCallbacks[pendingMessage.state];
	if (!callback) return 'Invalid state'

	const response = await callback({ pendingMessage, content, authorId, message, attachments });
	return response;
}
