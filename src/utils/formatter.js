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

export function format(text) {
	// Replace all color codes with actual color codes
	for (const [key, value] of Object.entries(codeMappings)) {
		text = text.replaceAll(key, value);
	}
	text = `\`\`\`ansi\n${text}\`\`\``;
	return text;
}
