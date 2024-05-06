export function parseSystemMessage(model) {
	const messages = [];

	const lines = model.split('\n');

	let role = 'system';
	let roleHasChanged = false;

	for (const line of lines) {
		if (!line) continue;

		let content = line;
		if (line.toLowerCase().startsWith('user:')) {
			roleHasChanged = role !== 'user';
			role = 'user';
			content = line.replace('User:', '').trim();
		} else if (line.toLowerCase().startsWith('assistant:')) {
			roleHasChanged = role !== 'assistant';
			role = 'assistant';
			content = line.replace('Assistant:', '').trim();
		} else {
			roleHasChanged = false;
		}

		const message = { role, content };

		if (roleHasChanged || messages.length === 0) {
			messages.push(message);
		} else {
			const lastMessage = messages[messages.length - 1];
			lastMessage.content += ' ' + content;
		}
	}

	return messages;
}
