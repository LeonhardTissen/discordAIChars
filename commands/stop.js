import { forceStop } from "../src/ollama.js";
import { registerCommand } from "../src/registrar.js";

/**
 * Stop the current generation
 * @returns {string} - The response message 
 * @example !stop
 */
function cmdStop() {
	forceStop();
	return `### Stopped current generation`;
}

registerCommand('stop', cmdStop, 'Interact', 'Stop current generation');
