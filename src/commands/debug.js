import { registerCommand } from "../registrar.js";
import { FgWhite } from "../consolecolors.js";
import { getAllMessages } from "../ollama/previousmessages.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
function cmdDebug() {
	const formattedMessages = JSON.stringify(getAllMessages(), null, 2);
	console.log(`${FgWhite}${formattedMessages}`)
}

registerCommand('debug', cmdDebug, 'Debug', 'Debug command to print previous messages');
