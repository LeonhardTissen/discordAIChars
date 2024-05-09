import { forceStop } from "../ollama/forcestop.js";
import { registerCommand } from "../registrar.js";

/**
 * Stop the current generation
 * @returns {string} - The response message 
 * @example !stop
 */
function cmdStop() {
	forceStop();
	return `Stopped current generation`;
}

registerCommand('stop', cmdStop, 'Interact', 'Stop current generation');
