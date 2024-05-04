# Discord AI Chars

Discord AI Chars is a bot that can switch between models and send AI-generated messages via webhooks. It uses the Ollama library to generate the AI responses.

![Preview GIF](https://s.warze.org/discordaichars.gif)

## Features ✨

- Switch between different AI models that are created by users
- Send AI-generated messages via webhooks
- Have multiple models talking to each other

## Commands 📜

![Commands List generated by help command](https://s.warze.org/discordaichars2.png)

## Requirements 📦

- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/download)

## Quick Install ⚡

Linux/macOS:

```sh
sh -c "$(curl -sS https://raw.githubusercontent.com/LeonhardTissen/discordAIChars/master/installer/install.sh)"
```

Windows:

- [Run this batch file](https://raw.githubusercontent.com/LeonhardTissen/discordAIChars/master/installer/install.bat)

## Manual Setup 🔨

1. Clone the repository

```sh
git clone https://github.com/LeonhardTissen/discordAIChars.git
```

2. Change into the directory

```sh
cd discordAIChars
```

3. Install the dependencies

```sh
npm i
```

4. Create a [Discord bot](https://discord.com/developers/applications) and invite it to your server. Make sure it has the `Manage Webhooks` permission and the message intent enabled

5. Copy `example.env` to `.env` and fill in the required values

```env
BOT_TOKEN=YourBotTokenHere
CHANNEL_ID=YourChannelIdHere
BASE_MODEL=dolphin-llama3
PREFIX=!
MAXIMUM_MODEL_CHAIN=5
ADMIN_ID=YourDiscordUserIdHere
```

6. Download the model of your choice from [Ollama](https://ollama.com/library), for example:

```sh
ollama pull dolphin-llama3
```

7. Run the bot

```sh
node main
```

## Get started 🚀

1. Type `!create` to start the creation of a new model. The bot will ask you for a name, then a profile picture, then the prompt for the model
2. Type `!default [name]` to make that model the default for the channel. Now all messages will be responded to by the bot

## Contributing 🤝

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
