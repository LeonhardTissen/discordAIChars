import { registerCommand } from "../src/registrar.js";
import { FgWhite } from "../src/consolecolors.js";
import { getAllMessages } from "../src/ollama/previousmessages.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
function cmdDebug() {
	const formattedMessages = JSON.stringify(getAllMessages(), null, 2);
	console.log(`${FgWhite}${formattedMessages}`)
}

registerCommand('debug', cmdDebug, 'Debug', 'Debug command to print previous messages');
