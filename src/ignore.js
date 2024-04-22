/**
 * Check if a message should be ignored by the bot
 * @param {string} message 
 * @returns {boolean} - True if the message should be ignored
 * @example isIgnored('') // Returns true
 * @example isIgnored('#ignore this') // Returns true
 * @example isIgnored('_ignore this') // Returns true
 * @example isIgnored('normal message') // Returns false
 */
export function isIgnored(message) {
	return message.startsWith('#') || message.startsWith('_') || message.length === 0;
}
