import { format } from "../src/formatter.js";
import { registerCommand, commands, categoryNames } from "../registrar.js";

/**
 * Display help text.
 * @returns {string} - The response message
 * @example !help
 */
function cmdHelp() {
	const helpCategories = {};

	commands.forEach(({ command, category, description, parameters }) => {
		if (!helpCategories[category]) {
			helpCategories[category] = [];
		}

		helpCategories[category].push({ command, description, parameters });
	});

	let helpText = Object.entries(helpCategories).map(([category, commands]) => {
		const commandText = commands.map(({ command, description, parameters }) => {
			const formattedCommand = `$y$!${command}`;
			const formattedParameters = parameters ? ` $g${parameters}` : '';
			const formattedDescription = description ? `$x: $w${description}` : '';
			return `- ${formattedCommand}${formattedParameters}${formattedDescription}`;
		}).join('\n');

		return `$t${categoryNames[category]}:\n${commandText}\n`;
	}).join('\n');

	helpText += '\n$pMessages starting with # or _ will be ignored by the AI. It will also ignore any messages while a message is being generated.';

	return format(helpText);
}

registerCommand('help', cmdHelp, 'Other', 'Display help text');
