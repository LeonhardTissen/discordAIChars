import { format } from "../src/formatter.js";
import { registerCommand, commands, categoryNames } from "../src/registrar.js";

/**
 * Display help text.
 * @param {string} searchTerm - The command to get help for 
 * @returns {string} - The response message
 * @example !help
 */
function cmdHelp(searchTerm) {
	const helpCategories = {};

	// Group commands together by category
	commands.forEach(({ command, category, description, parameters }) => {
		// Skip debug commands
		if (category === 'Debug') return;

		// Skip commands that don't match the search term
		if (searchTerm && !command.includes(searchTerm)) return;

		if (!helpCategories[category]) {
			helpCategories[category] = [];
		}

		helpCategories[category].push({ command, description, parameters });
	});

	// No commands found
	if (Object.keys(helpCategories).length === 0) {
		return '### No commands found';
	}

	let helpText = Object.entries(helpCategories).map(([category, commands]) => {
		const allCommandsInCategory = commands.map(({ command, description, parameters }) => {
			const formattedCommand = `$y$!${command}`;
			const formattedParameters = parameters ? ` $g${parameters}` : '';
			const formattedDescription = description ? `$x: $w${description}` : '';
			// Ex: - !transfer [name] [user]: Transfer ownership of a model to another user
			return `- ${formattedCommand}${formattedParameters}${formattedDescription}`;
		}).join('\n');

		return `$t${categoryNames[category]}:\n${allCommandsInCategory}\n`;
	}).join('\n');
	
	if (!searchTerm) {
		helpText += '\n$pMessages starting with # or _ will be ignored by the AI. It will also ignore any messages while a message is being generated.';
	}

	return format(helpText);
}

registerCommand('help', cmdHelp, 'Other', 'Display help text');
