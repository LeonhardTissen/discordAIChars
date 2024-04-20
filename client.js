import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';

export const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});

client.once('ready', () => {
    console.log('Bot is online!');

	// Set the bot's status
	client.user.setPresence({ 
		activities: [{ 
			name: 'with AI models !help', 
			type: ActivityType.Playing,
		}],
		status: 'online' 
	});
});
