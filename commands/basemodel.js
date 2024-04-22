const BASE_MODEL = process.env.BASE_MODEL;

/**
 * Returns the base model
 * @returns {string} - The response message containing the base model
 * @example !basemodel
 */
export function cmdBasemodel() {
	return `### Base model: ${BASE_MODEL}`
}
