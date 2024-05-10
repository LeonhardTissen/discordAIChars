import ollama from "ollama";
import { registerCommand } from "../registrar.js";

/**
 * Stop the current generation
 * @returns {string} - The response message 
 * @example !stop
 */
function cmdStop() {
	ollama.abort();
	return `Stopped current generation`;
}

registerCommand('stop', cmdStop, 'Interact', 'Stop current generation');
