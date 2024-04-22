import { previousMessages } from "../src/ollama.js";

/**
 * Debug command to print previous messages.
 * @example !debug
 */
export function cmdDebug() {
	console.log(previousMessages)
}
