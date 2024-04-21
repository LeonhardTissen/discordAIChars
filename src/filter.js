// Filter out mentions and other unwanted content
export function filterOutput(output) {
	if (output.length === 0) {
		return '<empty message>';
	}
	return output
		.replace(/<@!?[0-9]+>/g, '')
		.replace(/@everyone/g, '')
		.replace(/@here/g, '')
		.slice(0, 1998);
}