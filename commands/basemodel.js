import { registerCommand } from "../src/registrar.js";

const BASE_MODEL = process.env.BASE_MODEL;

/**
 * Returns the base model
 * @returns {string} - The response message containing the base model
 * @example !basemodel
 */
function cmdBasemodel() {
	return `### Base model: ${BASE_MODEL}`
}

registerCommand('basemodel', cmdBasemodel, 'Other', 'Returns the base model');
