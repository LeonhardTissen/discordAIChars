# Discord AI Chars

Discord AI Chars is a bot that can switch between models and send AI-generated messages via webhooks. It uses the Ollama library to generate the AI responses.

## Features

- Switch between different AI models that are created by users
- Send AI-generated messages via webhooks

## Commands

- `!create`: Create a new model
- `!delete [name]`: Delete a model, if you own it
- `!prompt [name] [prompt]`: Shows or edit prompt for a model, if you own it
- `!transfer [name] [user]`: Transfer ownership of a model to another user
- `!list`: List all models
- `!info [name]`: Show info about a model
- `!ask [name] [prompt]`: Talk to a model directly
- `!clear [name]`: Clear the previous messages for a model
- `!default [name]`: Set the default model for the channel. Not specifying a model will clear the default model
- `!help`: Show the help message
- `!basemodel`: Show the base model

## Requirements

- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/download)

## Setup

1. Clone the repository
2. Install the dependencies with `npm install`
3. Copy [``example.env``] to [``.env``] and fill in the required values
4. Download the model of your choice from [Ollama](https://ollama.com/library), example: [``ollama run llama3``]
5. Run the bot with `node main.js`

## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
