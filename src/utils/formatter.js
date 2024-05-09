const { PREFIX } = process.env;

const codeMappings = {
	'$!': PREFIX,
	'$w': '[2;37m', // White
	'$t': '[2;36m', // Teal
	'$p': '[2;35m', // Pink
	'$b': '[2;34m', // Blue
	'$y': '[2;33m', // Yellow
	'$g': '[2;32m', // Green
	'$r': '[2;31m', // Red
	'$x': '[2;30m', // Gray
}

/**
 * Format text containing color codes and prefix
 * @param {String} text - Text to format
 * @returns {String} - Formatted text
 */
export function format(text) {
	// Replace all color codes with actual color codes
	for (const [key, value] of Object.entries(codeMappings)) {
		text = text.replaceAll(key, value);
	}
	text = `\`\`\`ansi\n${text}\`\`\``;
	return text;
}

/**
 * Format response text
 * @param {String} text - Text to format
 * @returns {String} - Formatted text
 */
export function formatResponse(text) {
	if (!text.startsWith('```')) {
		return '### ' + text;
	}
	return text;
}

/**
 * Format response text
 * @param {String} text - Text to format
 * @param {Object} image - Image path to attach
 * @returns {Object} - Message object
 */
export function formatMessage(text, image = null) {
	const messageObject = {
		content: formatResponse(text),
	};
	if (image) {
		messageObject.files = [image];
	}
	return messageObject;
}
