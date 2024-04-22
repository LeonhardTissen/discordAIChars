import fs from 'fs';
import { format } from "../src/formatter.js";

/**
 * Display help text.
 * @returns {string} - The response message
 * @example !help
 */
export function cmdHelp() {
	const helpFile = fs.readFileSync('help.txt', 'utf8')
	return format(helpFile);
}
