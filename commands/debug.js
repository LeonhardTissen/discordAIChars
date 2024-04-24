import { registerCommand } from "../src/registrar.js";
import { previousMessages } from "../src/ollama.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
function cmdDebug() {
	console.log(previousMessages)
}

registerCommand('debug', cmdDebug, 'Debug', 'Debug command to print previous messages');
