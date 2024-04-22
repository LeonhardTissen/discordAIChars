import fs from 'fs';
import { format } from "../src/formatter.js";

export function cmdHelp() {
	const helpFile = fs.readFileSync('help.txt', 'utf8')
	return format(helpFile);
}
