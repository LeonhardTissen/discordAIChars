/**
 * Filter the output to remove mentions, @everyone, and @here as well as limit the length to 2000 characters.
 * @param {string} output 
 * @returns {string} - The filtered output
 * @example filterOutput('Hello <@1234567890>!') // Returns 'Hello user!'
 */
export function filterOutput(output) {
	if (output.length === 0) {
		return '<empty message>';
	}
	return output
		.replace(/<@!?\d+>/g, 'user')
		.replace(/@everyone/g, 'everyone')
		.replace(/@here/g, 'everyone')
		.slice(0, 1998);
}
