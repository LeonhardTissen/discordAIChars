#!/bin/bash

# Check if Ollama, Git, and Node.js are installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama is required but not installed. Please install it from https://ollama.com/download."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "Git is required but not installed. Please install it."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install it from https://nodejs.org/."
    exit 1
fi

# Prompt for configuration details
read -p "Enter your Discord bot token: " BOT_TOKEN
read -p "Enter your Discord channel ID: " CHANNEL_ID
read -p "Enter your Discord admin user ID: " ADMIN_ID

# Clone the repository
git clone https://github.com/LeonhardTissen/discordAIChars.git

# Change into the directory
cd discordAIChars

# Install dependencies
npm install

# Copy example.env to .env and populate with provided values
cp example.env .env
sed -i "s/BOT_TOKEN=YourBotTokenHere/BOT_TOKEN=$BOT_TOKEN/" .env
sed -i "s/CHANNEL_ID=YourChannelIdHere/CHANNEL_ID=$CHANNEL_ID/" .env
sed -i "s/ADMIN_ID=YourDiscordUserIdHere/ADMIN_ID=$ADMIN_ID/" .env

# Prompt for the desired base model (default is dolphin-llama3)
read -p "Enter the base model (default: dolphin-llama3): " BASE_MODEL
BASE_MODEL=${BASE_MODEL:-dolphin-llama3}

# Download the specified model using Ollama
ollama pull $BASE_MODEL

# Run the bot
node main
