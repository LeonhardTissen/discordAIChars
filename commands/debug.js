import { registerCommand } from "../src/registrar.js";
import { previousMessages } from "../src/ollama.js";
import { FgWhite } from "../src/consolecolors.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
function cmdDebug() {
	const formattedMessages = JSON.stringify(previousMessages, null, 2);
	console.log(`${FgWhite}${formattedMessages}`)
}

registerCommand('debug', cmdDebug, 'Debug', 'Debug command to print previous messages');
