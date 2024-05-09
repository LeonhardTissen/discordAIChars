import { registerCommand } from "../registrar.js";
import { color } from "../utils/consolecolors.js";
import { getAllMessages } from "../ollama/previousmessages.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
function cmdDebug() {
	const formattedMessages = JSON.stringify(getAllMessages(), null, 2);
	console.log(`${color.White}${formattedMessages}`)
}

registerCommand('debug', cmdDebug, 'Debug', 'Debug command to print previous messages');
