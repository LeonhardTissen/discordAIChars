import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { setChannel } from './channel.js';
import { getOrCreateWebhook } from './webhook.js';
import { FgGreen } from './utils/consolecolors.js';

const { PREFIX, CHANNEL_ID } = process.env;

export const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Message],
});

client.once('ready', async () => {
    console.log(`${FgGreen}Bot is online!`);

	setChannel(client.channels.cache.get(CHANNEL_ID));
	await getOrCreateWebhook();

	// Set the bot's status
	client.user.setPresence({ 
		activities: [{ 
			name: `with AI models ${PREFIX}help`, 
			type: ActivityType.Playing,
		}],
		status: 'online' 
	});
});
