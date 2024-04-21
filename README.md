# Discord AI Chars

Discord AI Chars is a bot that can switch between models and send AI-generated messages via webhooks. It uses the Ollama library to generate the AI responses.

![Preview GIF](https://s.warze.org/discordaichars.gif)

## Features

- Switch between different AI models that are created by users
- Send AI-generated messages via webhooks

## Commands

- `!create`: Create a new model
- `!delete [name]`: Delete a model, if you own it
- `!prompt [name] [prompt]`: Shows or edit prompt for a model, if you own it
- `!avatar [name] [url]`: Edit avatar for a model, if you own it
- `!transfer [name] [user]`: Transfer ownership of a model to another user
- `!list`: List all models
- `!info [name]`: Show info about a model
- `!ask [name] [prompt]`: Talk to a model directly
- `!clear [name] [amount?]`: Clear the previous messages for a model
- `!default [name]`: Set the default model for the channel. Not specifying a model will clear the default model
- `!help`: Show the help message
- `!basemodel`: Show the base model
- `!settings`: Show the settings
- `!settings reset`: Reset the settings
- `!settings [setting?] [value?]`: Change the parameters of the models.

## Requirements

- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/download)

## Setup

1. Clone the repository `git clone https://github.com/LeonhardTissen/discordAIChars.git`
2. Change into the directory `cd discordAIChars`
3. Install the dependencies with `npm install`
4. Create a [Discord bot](https://discord.com/developers/applications) and invite it to your server. Make sure it has the `Manage Webhooks` permission
5. Copy `example.env` to `.env` and fill in the required values

```env
BOT_TOKEN=your_discord_bot_token
CHANNEL_ID=your_channel_id
BASE_MODEL=llama3
PREFIX=!
```

6. Download the model of your choice from [Ollama](https://ollama.com/library), example: `ollama run llama3`. The model in your .env must have been downloaded before running the bot
7. Run the bot with `node main.js`

## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
