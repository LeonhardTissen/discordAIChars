import 'dotenv/config'
import fs from 'fs';

const PREFIX = process.env.PREFIX;

const codeMappings = {
	'$!': PREFIX,
	'$w': '[2;37m', // White
	'$t': '[2;36m', // Teal
	'$p': '[2;35m', // Pink
	'$y': '[2;33m', // Yellow
	'$g': '[2;32m', // Green
	'$x': '[2;30m', // Gray
}

export function getHelpMessage() {
	// Load help.txt file and send it, replace {prefix} with the actual prefix
	let helpText = fs.readFileSync('help.txt', 'utf8');

	// Replace all color codes with actual color codes
	for (const [key, value] of Object.entries(codeMappings)) {
		helpText = helpText.replaceAll(key, value);
	}

	return helpText;
}
