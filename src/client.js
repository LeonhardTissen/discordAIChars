import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';

const PREFIX = process.env.PREFIX;

export const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});

client.once('ready', async () => {
    console.log('Bot is online!');

	// Set the bot's status
	client.user.setPresence({ 
		activities: [{ 
			name: `with AI models ${PREFIX}help`, 
			type: ActivityType.Playing,
		}],
		status: 'online' 
	});
});
