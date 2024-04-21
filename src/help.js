import fs from 'fs';
import { format } from './formatter.js';

export function getHelpMessage() {
	let helpText = fs.readFileSync('help.txt', 'utf8');

	return format(helpText);
}
